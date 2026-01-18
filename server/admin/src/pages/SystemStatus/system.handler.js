import pidusage from 'pidusage';
import os from 'os';
import fs from 'fs';
import checkDiskSpace from 'check-disk-space';
import { ApiClient } from 'adminjs';
import Docker from 'dockerode';

const LOG_FILE_PATH = '/logs/access.log';
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

/**
 * Basic formatting for bytes
 */
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Handler for System Status Page
 */
export const systemStatusHandler = async (request, response, context) => {
    if (request.method === 'get') {
        try {
            // 1. Container Specs (App Usage)
            // pidusage returns stats for the current Node.js process
            const appStats = await pidusage(process.pid);

            // 2. Host/Server Specs (Total System)
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const cpuCount = os.cpus().length;
            const loadAvg = os.loadavg(); // [1, 5, 15] min

            // 3. Disk Usage (Check root volume)
            let diskStats = { free: 0, size: 0 };
            try {
                // On Linux/Docker, checking '/' gives the container overlay size which usually reflects available space
                diskStats = await checkDiskSpace('/');
            } catch (e) {
                console.error('Disk check failed:', e);
            }

            // 4. Docker Containers
            let containers = [];
            try {
                const containerList = await docker.listContainers({ all: true });
                containers = containerList.map(c => ({
                    id: c.Id.substring(0, 12),
                    name: c.Names[0]?.replace('/', '') || 'Unknown',
                    image: c.Image,
                    state: c.State, // running, exited
                    status: c.Status, // Up 2 hours
                    ports: (c.Ports || []).map(p => `${p.PrivatePort}->${p.PublicPort}`).join(', ')
                }));
            } catch (e) {
                console.error('Docker list failed:', e);
                containers = [{ name: 'Error fetching Docker info', status: e.message, state: 'error', ports: [] }];
            }

            // 5. Read Caddy Logs (Analyze Login Attempts)
            const logs = [];
            const loginAttempts = [];

            if (fs.existsSync(LOG_FILE_PATH)) {
                // Read the whole file (or large chunk - adjust buffer if needed)
                const fileData = fs.readFileSync(LOG_FILE_PATH, 'utf-8');
                const adminPath = process.env.ADMIN_PATH || '/admin';
                const loginPath = process.env.ADMIN_LOGIN_PATH || `${adminPath}/login`;

                // Split by newline and process last 500 lines to find login attempts
                const lines = fileData.trim().split('\n');

                // Reverse to get newest first
                for (let i = lines.length - 1; i >= 0; i--) {
                    if (!lines[i]) continue;
                    try {
                        const logEntry = JSON.parse(lines[i]);
                        const uri = logEntry.request?.uri || '';
                        const method = logEntry.request?.method || '';
                        const status = logEntry.status;

                        // Smart Filter for Login Attempts
                        // 1. POST requests to login path (Actual login form submission)
                        // 2. 401/403 Forbidden/Unauthorized accesses (Brute force or invalid access)
                        // 3. Exclude static assets/page loads (GET 200/304)

                        const isLoginSubmission = method === 'POST' && uri.includes(loginPath);
                        const isAuthError = (status === 401 || status === 403) && uri.startsWith(adminPath);

                        // Optional: Check X-Forwarded-For if behind another proxy, otherwise remote_ip
                        const realIp = logEntry.request?.headers?.['X-Forwarded-For']?.[0] || logEntry.request?.remote_ip || 'Unknown';

                        if (isLoginSubmission || isAuthError) {
                            loginAttempts.push({
                                ts: logEntry.ts, // Unix timestamp
                                ip: realIp,
                                method: method,
                                status: logEntry.status,
                                userAgent: logEntry.request?.headers?.['User-Agent']?.[0] || 'Unknown'
                            });
                        }

                        // Limit to last 50 attempts
                        if (loginAttempts.length >= 50) break;

                    } catch (e) {
                        // Skip malformed lines
                        continue;
                    }
                }
            } else {
                loginAttempts.push({ ip: 'Log file not found', status: 0 });
            }

            return {
                app: {
                    cpu: appStats.cpu.toFixed(1), // %
                    memory: formatBytes(appStats.memory),
                    uptime: (appStats.elapsed / 1000).toFixed(0), // seconds
                },
                server: {
                    cpuLoad: loadAvg[0].toFixed(2), // 1 min load
                    cpuCount,
                    memory: {
                        total: formatBytes(totalMem),
                        used: formatBytes(usedMem),
                        free: formatBytes(freeMem),
                        percent: ((usedMem / totalMem) * 100).toFixed(1)
                    },
                    disk: {
                        total: formatBytes(diskStats.size),
                        free: formatBytes(diskStats.free),
                        used: formatBytes(diskStats.size - diskStats.free),
                        percent: (((diskStats.size - diskStats.free) / diskStats.size) * 100).toFixed(1)
                    },
                    platform: `${os.type()} ${os.release()} (${os.arch()})`
                },
                docker: containers,
                logs: loginAttempts
            };

        } catch (error) {
            console.error('System Status Error:', error);
            throw error;
        }
    }
    return {};
};
