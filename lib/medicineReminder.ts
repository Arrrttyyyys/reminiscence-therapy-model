'use client';

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  takenToday: boolean;
  lastTaken?: string;
}

interface MedicineReminder {
  medicine: Medicine;
  time: string;
  dueSoon: boolean;
  overdue: boolean;
}

/**
 * Medicine Reminder System
 * Checks when medicines need to be taken based on time of day
 */
export class MedicineReminderService {
  /**
   * Get current time period (Morning, Afternoon, Evening, Night)
   */
  private getCurrentTimePeriod(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
  }

  /**
   * Check if medicine should be taken now based on time of day
   */
  shouldTakeNow(medicine: Medicine): boolean {
    const currentPeriod = this.getCurrentTimePeriod();
    return medicine.timeOfDay.includes(currentPeriod) && !medicine.takenToday;
  }

  /**
   * Get all medicines that are due now or soon
   */
  getDueMedicines(medicines: Medicine[]): MedicineReminder[] {
    const activeMedicines = medicines.filter(m => {
      if (m.endDate && new Date(m.endDate) < new Date()) return false;
      return true;
    });

    const currentPeriod = this.getCurrentTimePeriod();
    const reminders: MedicineReminder[] = [];

    activeMedicines.forEach(medicine => {
      // Check if medicine should be taken in current period
      if (medicine.timeOfDay.includes(currentPeriod) && !medicine.takenToday) {
        reminders.push({
          medicine,
          time: currentPeriod,
          dueSoon: true,
          overdue: false,
        });
      }

      // Check for next period (if medicine is not taken and next period is soon)
      const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];
      const currentIndex = periods.indexOf(currentPeriod);
      const nextPeriod = periods[(currentIndex + 1) % periods.length];
      
      if (medicine.timeOfDay.includes(nextPeriod) && !medicine.takenToday) {
        // If current period is almost over (last 30 min), mark as due soon
        const hour = new Date().getHours();
        const isAlmostNextPeriod = 
          (currentPeriod === 'Morning' && hour >= 11 && hour < 12) ||
          (currentPeriod === 'Afternoon' && hour >= 16 && hour < 17) ||
          (currentPeriod === 'Evening' && hour >= 20 && hour < 21) ||
          (currentPeriod === 'Night' && hour >= 4 && hour < 5);

        if (isAlmostNextPeriod) {
          reminders.push({
            medicine,
            time: nextPeriod,
            dueSoon: true,
            overdue: false,
          });
        }
      }
    });

    return reminders;
  }

  /**
   * Check if notification should be shown
   */
  shouldShowNotification(medicine: Medicine): boolean {
    return this.shouldTakeNow(medicine);
  }

  /**
   * Get formatted notification message
   */
  getNotificationMessage(medicine: Medicine): string {
    const currentPeriod = this.getCurrentTimePeriod();
    return `Time to take ${medicine.name} (${medicine.dosage}) - ${currentPeriod} dose`;
  }
}

export const medicineReminderService = new MedicineReminderService();

