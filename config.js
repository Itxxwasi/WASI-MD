/**
 * WASI-MD V7 Configuration
 * Core Configuration Management System
 * © ITXXWASI
 * 
 * all the bot settings in one place
 * makes it easier to manage everything - wasi
 */

module.exports = {
    // Bot Information - basic stuff
    botInfo: {
        name: process.env.BOT_NAME || 'WASI-MD V7',
        version: '7.2.0', // current version
        author: 'ITXXWASI',
        description: 'Advanced WhatsApp Multi-Device Bot',
        website: 'https://wasi-tech.com'
    },
    
    // Owner Configuration - thats me lol
    owner: {
        number: process.env.OWNER_NUMBER || 255773146241',
        name: process.env.OWNER_NAME || 'ANUARI',
        isVerified: true // owner is always verified
    },
    
    // Bot Settings - customize these as needed
    settings: {
        prefix: process.env.PREFIX || '.', // command prefix
        mode: process.env.MODE || 'public', // public, private, group
        autoStatusView: process.env.AUTO_STATUS_VIEW === 'true', 
        autoRead: process.env.AUTO_READ === 'true', // auto read messages
        autoTyping: process.env.AUTO_TYPING === 'true', // show typing indicator
        autoRecording: process.env.AUTO_RECORDING === 'true', // show recording
        autoReact: process.env.AUTO_REACT === 'true', // auto react to messages
        antiDelete: process.env.ANTI_DELETE !== 'false', // save deleted messages
        antiCall: process.env.ANTI_CALL === 'true', // block calls
        antiLink: process.env.ANTI_LINK === 'true', // delete links
        antiBot: process.env.ANTI_BOT === 'true' // block other bots
    },
    
    // Session Configuration - important for auth
    session: {
        id: process.env.SESSION_ID, // whatsapp session id
        folder: './lib/Sessions', // where to save session
        saveInterval: 60000, // save every minute
        maxRetries: 5 // retry connection 5 times
    },
    
    // Database Configuration
    database: {
        type: process.env.DB_TYPE || 'mongodb',
        url: process.env.MONGO_URI || process.env.DATABASE_URL,
        name: 'wasimd_v7',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        }
    },
    
    // API Configuration
    api: {
        primary: 'https://api.wasi-tech.com/v7',
        secondary: 'https://backup-api.wasi-tech.com/v7',
        key: process.env.WASI_API_KEY || 'default_key',
        timeout: 30000,
        retries: 3
    },
    
    // Media Configuration
    media: {
        maxSize: 100 * 1024 * 1024, // 100MB
        allowedTypes: ['image', 'video', 'audio', 'document'],
        uploadEndpoint: 'https://cdn.wasi-tech.com/upload',
        downloadTimeout: 60000
    },
    
    // Plugin Configuration
    plugins: {
        folder: './plugins',
        autoLoad: true,
        disabled: process.env.DISABLED_PLUGINS?.split(',') || [],
        customPath: process.env.CUSTOM_PLUGINS_PATH
    },
    
    // Security Configuration
    security: {
        encryptionKey: process.env.ENCRYPTION_KEY || 'wasi_default_key_v7',
        tokenExpiry: 86400000, // 24 hours
        maxLoginAttempts: 5,
        blockDuration: 3600000, // 1 hour
        allowedOrigins: ['*']
    },
    
    // Rate Limiting
    rateLimit: {
        enabled: true,
        maxRequests: 30,
        windowMs: 60000, // 1 minute
        message: 'Too many requests, please try again later.'
    },
    
    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: './logs/wasi.log',
        maxSize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
        console: true
    },
    
    // Cache Configuration
    cache: {
        enabled: true,
        ttl: 300000, // 5 minutes
        maxSize: 1000,
        checkPeriod: 60000 // 1 minute
    },
    
    // Backup Configuration
    backup: {
        enabled: process.env.BACKUP_ENABLED === 'true',
        interval: 86400000, // 24 hours
        location: './backups',
        maxBackups: 7
    },
    
    // Update Configuration
    update: {
        autoCheck: true,
        checkInterval: 3600000, // 1 hour
        autoUpdate: process.env.AUTO_UPDATE === 'true',
        branch: process.env.UPDATE_BRANCH || 'master'
    },
    
    // Performance Configuration
    performance: {
        maxConcurrentTasks: 10,
        taskTimeout: 30000,
        memoryLimit: 512 * 1024 * 1024, // 512MB
        cpuLimit: 80 // percentage
    },
    
    // Feature Flags
    features: {
        aiChat: process.env.ENABLE_AI === 'true',
        voiceCommands: process.env.ENABLE_VOICE === 'true',
        imageGeneration: process.env.ENABLE_IMAGE_GEN === 'true',
        videoProcessing: process.env.ENABLE_VIDEO === 'true',
        gameCommands: process.env.ENABLE_GAMES === 'true',
        economySystem: process.env.ENABLE_ECONOMY === 'true'
    },
    
    // External Services
    services: {
        openai: {
            enabled: !!process.env.OPENAI_API_KEY,
            key: process.env.OPENAI_API_KEY,
            model: 'gpt-3.5-turbo'
        },
        google: {
            enabled: !!process.env.GOOGLE_API_KEY,
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CX
        },
        weather: {
            enabled: !!process.env.WEATHER_API_KEY,
            key: process.env.WEATHER_API_KEY
        }
    },
    
    // Webhook Configuration
    webhook: {
        enabled: process.env.WEBHOOK_ENABLED === 'true',
        url: process.env.WEBHOOK_URL,
        secret: process.env.WEBHOOK_SECRET,
        events: ['message', 'status', 'call']
    }
};
