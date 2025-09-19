// Browser storage utilities for StyleFinder Quiz persistence
import { QuizSubmission, Section1Response, Section2Response } from './types';
import { logger } from './logger';

export type QuizStep = 'userInfo' | 'section1' | 'section2' | 'complete' | 'submitting';

export interface StoredQuizData {
  version: string;
  timestamp: number;
  expiresAt: number;
  userData: {
    userName?: string;
    userEmail?: string;
  };
  quizProgress: {
    currentStep: QuizStep;
    section1: Partial<Section1Response>;
    section2: Partial<Section2Response>;
    completedGroups: string[];
    currentGroup?: string;
    currentQuestion?: number;
  };
  metadata: {
    startedAt: number;
    lastSavedAt: number;
    saveCount: number;
  };
}

export class QuizStorage {
  private static readonly STORAGE_KEY = 'stylefinder_quiz_data';
  private static readonly VERSION = '1.0.0';
  private static readonly EXPIRY_HOURS = 24; // Data expires after 24 hours
  private static readonly MAX_SAVE_ATTEMPTS = 3;

  /**
   * Check if localStorage is available and functional
   */
  static isStorageAvailable(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, 'test');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      logger.warn('storage', 'LocalStorage not available', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      return false;
    }
  }

  /**
   * Save quiz data to localStorage with error handling
   */
  static saveQuizData(data: Partial<StoredQuizData>): boolean {
    if (!this.isStorageAvailable()) return false;

    try {
      const existingData = this.loadQuizData();
      const now = Date.now();
      
      const updatedData: StoredQuizData = {
        version: this.VERSION,
        timestamp: now,
        expiresAt: now + (this.EXPIRY_HOURS * 60 * 60 * 1000),
        userData: {
          ...existingData?.userData,
          ...data.userData
        },
        quizProgress: {
          currentStep: 'userInfo',
          section1: {},
          section2: { answers: [] },
          completedGroups: [],
          ...existingData?.quizProgress,
          ...data.quizProgress
        },
        metadata: {
          startedAt: existingData?.metadata?.startedAt || now,
          lastSavedAt: now,
          saveCount: (existingData?.metadata?.saveCount || 0) + 1
        }
      };

      const serializedData = JSON.stringify(updatedData);
      
      // Check if data size is reasonable (< 4MB to leave room for other data)
      if (serializedData.length > 4 * 1024 * 1024) {
        logger.error('storage', 'Quiz data too large for localStorage', {
          dataSize: serializedData.length
        });
        return false;
      }

      window.localStorage.setItem(this.STORAGE_KEY, serializedData);
      
      logger.debug('storage', 'Quiz data saved successfully', {
        dataSize: serializedData.length,
        saveCount: updatedData.metadata.saveCount,
        currentStep: updatedData.quizProgress.currentStep
      });
      
      return true;
    } catch (error: any) {
      logger.error('storage', 'Failed to save quiz data', {
        error: error.message,
        name: error.name,
        code: error.code
      });
      
      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        this.handleStorageQuotaExceeded();
      }
      
      return false;
    }
  }

  /**
   * Load quiz data from localStorage with validation
   */
  static loadQuizData(): StoredQuizData | null {
    if (!this.isStorageAvailable()) return null;

    try {
      const serializedData = window.localStorage.getItem(this.STORAGE_KEY);
      if (!serializedData) return null;

      const data: StoredQuizData = JSON.parse(serializedData);
      
      // Validate data structure and version
      if (!this.isValidStoredData(data)) {
        logger.warn('storage', 'Invalid stored quiz data found, clearing', {
          version: (data as any)?.version,
          hasUserData: !!(data as any)?.userData,
          hasProgress: !!(data as any)?.quizProgress
        });
        this.clearQuizData();
        return null;
      }

      // Check if data has expired
      if (Date.now() > data.expiresAt) {
        logger.info('storage', 'Stored quiz data has expired, clearing', {
          expiresAt: new Date(data.expiresAt).toISOString(),
          age: Date.now() - data.timestamp
        });
        this.clearQuizData();
        return null;
      }

      logger.debug('storage', 'Quiz data loaded successfully', {
        version: data.version,
        age: Date.now() - data.timestamp,
        currentStep: data.quizProgress.currentStep,
        saveCount: data.metadata.saveCount
      });

      return data;
    } catch (error: any) {
      logger.error('storage', 'Failed to load quiz data', {
        error: error.message
      });
      
      // If data is corrupted, clear it
      this.clearQuizData();
      return null;
    }
  }

  /**
   * Clear all stored quiz data
   */
  static clearQuizData(): void {
    if (!this.isStorageAvailable()) return;

    try {
      window.localStorage.removeItem(this.STORAGE_KEY);
      logger.info('storage', 'Quiz data cleared successfully');
    } catch (error: any) {
      logger.error('storage', 'Failed to clear quiz data', {
        error: error.message
      });
    }
  }

  /**
   * Check if user has any saved quiz progress
   */
  static hasSavedProgress(): boolean {
    const data = this.loadQuizData();
    if (!data) return false;

    const { quizProgress, userData } = data;
    
    // Check if user has made any meaningful progress
    const hasUserInfo = userData.userName || userData.userEmail;
    const hasSection1Progress = Object.keys(quizProgress.section1).length > 0;
    const hasSection2Progress = quizProgress.section2.answers && quizProgress.section2.answers.length > 0;
    
    return !!(hasUserInfo || hasSection1Progress || hasSection2Progress);
  }

  /**
   * Get summary of saved progress for display
   */
  static getProgressSummary(): {
    hasProgress: boolean;
    currentStep: QuizStep;
    completedSections: string[];
    lastSaved: Date;
    canResume: boolean;
  } | null {
    const data = this.loadQuizData();
    if (!data) return null;

    const completedSections: string[] = [];
    
    if (data.userData.userName && data.userData.userEmail) {
      completedSections.push('User Info');
    }
    
    if (Object.keys(data.quizProgress.section1).length > 0) {
      completedSections.push('Section 1');
    }
    
    if (data.quizProgress.section2.answers && data.quizProgress.section2.answers.length > 0) {
      completedSections.push('Section 2');
    }

    return {
      hasProgress: completedSections.length > 0,
      currentStep: data.quizProgress.currentStep,
      completedSections,
      lastSaved: new Date(data.metadata.lastSavedAt),
      canResume: completedSections.length > 0 && data.quizProgress.currentStep !== 'complete'
    };
  }

  /**
   * Convert stored data back to quiz submission format
   */
  static toQuizSubmission(data: StoredQuizData): Partial<QuizSubmission> {
    return {
      userName: data.userData.userName,
      userEmail: data.userData.userEmail,
      section1: data.quizProgress.section1 as Section1Response,
      section2: data.quizProgress.section2 as Section2Response,
      timestamp: new Date(data.timestamp)
    };
  }

  /**
   * Auto-save functionality with debouncing
   */
  private static saveTimeout: NodeJS.Timeout | null = null;
  
  static autoSave(data: Partial<StoredQuizData>, delay: number = 1000): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      const success = this.saveQuizData(data);
      if (typeof window !== 'undefined') {
        if (success) {
          // Dispatch auto-save success event for UI feedback
          window.dispatchEvent(new CustomEvent('quizAutoSaved', { 
            detail: { timestamp: Date.now() }
          }));
        } else {
          // Dispatch auto-save error event for UI feedback
          window.dispatchEvent(new CustomEvent('quizAutoSaveError', {
            detail: { timestamp: Date.now() }
          }));
        }
      }
    }, delay);
  }

  /**
   * Clean up old or invalid stored data
   */
  static cleanup(): void {
    if (!this.isStorageAvailable()) return;

    try {
      // Remove any old storage keys from previous versions
      const oldKeys = [
        'quiz_data', 
        'stylefinder_data', 
        'quiz_progress',
        'user_quiz_data'
      ];
      
      oldKeys.forEach(key => {
        if (window.localStorage.getItem(key)) {
          window.localStorage.removeItem(key);
          logger.debug('storage', `Cleaned up old storage key: ${key}`);
        }
      });

      // Check current data validity
      const currentData = this.loadQuizData();
      if (!currentData) return;

      // Remove if too old (beyond expiry)
      if (Date.now() > currentData.expiresAt) {
        this.clearQuizData();
        logger.info('storage', 'Removed expired quiz data during cleanup');
      }
    } catch (error: any) {
      logger.error('storage', 'Error during storage cleanup', {
        error: error.message
      });
    }
  }

  /**
   * Validate stored data structure
   */
  private static isValidStoredData(data: any): data is StoredQuizData {
    if (!data || typeof data !== 'object') return false;
    
    return !!(
      data.version &&
      data.timestamp &&
      data.expiresAt &&
      data.userData &&
      data.quizProgress &&
      data.metadata &&
      typeof data.userData === 'object' &&
      typeof data.quizProgress === 'object' &&
      typeof data.metadata === 'object'
    );
  }

  /**
   * Handle storage quota exceeded error
   */
  private static handleStorageQuotaExceeded(): void {
    logger.warn('storage', 'Storage quota exceeded, attempting cleanup');
    
    try {
      // Clear other potential large items first
      const keysToCheck = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key && key !== this.STORAGE_KEY) {
          keysToCheck.push(key);
        }
      }
      
      // Sort by size and remove largest non-quiz items
      const itemSizes = keysToCheck.map(key => ({
        key,
        size: window.localStorage.getItem(key)?.length || 0
      })).sort((a, b) => b.size - a.size);
      
      let freedSpace = 0;
      for (const item of itemSizes.slice(0, 3)) { // Remove up to 3 largest items
        window.localStorage.removeItem(item.key);
        freedSpace += item.size;
        logger.debug('storage', `Removed ${item.key} (${item.size} chars) to free space`);
      }
      
      if (freedSpace > 0) {
        logger.info('storage', `Freed ${freedSpace} characters of storage space`);
      }
    } catch (cleanupError: any) {
      logger.error('storage', 'Failed to cleanup storage', {
        error: cleanupError.message
      });
    }
  }
}

/**
 * Hook-style interface for React components
 */
export const useQuizStorage = () => {
  return {
    save: (data: Partial<StoredQuizData>) => QuizStorage.saveQuizData(data),
    load: () => QuizStorage.loadQuizData(),
    clear: () => QuizStorage.clearQuizData(),
    autoSave: (data: Partial<StoredQuizData>, delay?: number) => 
      QuizStorage.autoSave(data, delay),
    hasSavedProgress: () => QuizStorage.hasSavedProgress(),
    getProgressSummary: () => QuizStorage.getProgressSummary(),
    isAvailable: () => QuizStorage.isStorageAvailable()
  };
};