import cron from 'node-cron';
import IssuedBook from '../Model/issuedbookmodel.js';

let isRunning = false;

/**
 * Auto-calculate fines for all unreturned books
 * Runs automatically via cron scheduler
 */
const autoCalculateFines = async () => {
    if (isRunning) {
        console.log('⚠️ Fine calculation already running, skipping...');
        return { success: false, message: 'Already running' };
    }
    
    isRunning = true;
    const startTime = Date.now();
    
    try {
        console.log('🔄 Starting auto-calculate fines at:', new Date().toLocaleString());
        
        // Find all unreturned books
        const issueRecords = await IssuedBook.find({ 
            isreturned: false 
        });

        if (!issueRecords || issueRecords.length === 0) {
            console.log('✅ No unreturned books found');
            return { success: true, updatedCount: 0, message: 'No unreturned books' };
        }

        const currentDate = new Date();
        let updatedCount = 0;
        let totalFine = 0;

        // Calculate fine for each overdue book
        for (const record of issueRecords) {
            const dueDate = new Date(record.dueDate);
            
            // Only calculate if book is overdue
            if (currentDate > dueDate) {
                const diffTime = currentDate.getTime() - dueDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const fine = diffDays * 100; // Rs. 100 per day
                
                // Update fine
                record.fine = fine;
                await record.save();
                
                updatedCount++;
                totalFine += fine;
                
                console.log(`📚 Book ID: ${record.bookId} - Fine: Rs. ${fine} (${diffDays} days overdue)`);
            }
        }

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        console.log(`✅ Fine calculation completed in ${duration}s`);
        console.log(`📊 Books updated: ${updatedCount} | Total fine: Rs. ${totalFine}`);
        
        return { 
            success: true, 
            updatedCount, 
            totalFine,
            duration: `${duration}s`,
            message: `Fine calculated for ${updatedCount} book(s)`
        };

    } catch (error) {
        console.error('❌ Error in auto-calculate fines:', error);
        return { 
            success: false, 
            error: error.message,
            message: 'Internal Server Error'
        };
    } finally {
        isRunning = false;
    }
};

/**
 * Start the cron scheduler
 * Runs daily at midnight
 */
const startFineScheduler = () => {
    // IMPORTANT: Uncomment this to run immediately on server start (for testing)
    // autoCalculateFines();
    
    // Schedule to run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        console.log('⏰ Daily fine calculation triggered at midnight');
        await autoCalculateFines();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata" // Change to your timezone
    });

    console.log('✅ Fine scheduler started - Will run daily at midnight (IST)');
    
    // TESTING SCHEDULES (uncomment one for testing):
    
    // Every minute (for testing only!)
    // cron.schedule('* * * * *', async () => {
    //     console.log('⏰ Test: Running every minute');
    //     await autoCalculateFines();
    // });
    
    // Every 5 minutes (for testing)
    // cron.schedule('*/5 * * * *', async () => {
    //     console.log('⏰ Test: Running every 5 minutes');
    //     await autoCalculateFines();
    // });
    
    // Every hour
    // cron.schedule('0 * * * *', async () => {
    //     console.log('⏰ Running every hour');
    //     await autoCalculateFines();
    // });
};

/**
 * Manual trigger for fine calculation
 * Use this as an API endpoint for admin to manually trigger
 */
const manualCalculateFines = async (req, res) => {
    try {
        console.log('🔧 Manual fine calculation triggered by admin');
        const result = await autoCalculateFines();
        
        res.json({
            success: result.success,
            message: result.message,
            data: {
                updatedCount: result.updatedCount || 0,
                totalFine: result.totalFine || 0,
                duration: result.duration
            }
        });
    } catch (error) {
        console.error('Error in manual fine calculation:', error);
        res.json({ 
            success: false, 
            message: 'Internal Server Error' 
        });
    }
};

export { 
    startFineScheduler, 
    autoCalculateFines, 
    manualCalculateFines 
};