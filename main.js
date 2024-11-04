document.getElementById('startTest').addEventListener('click', startSpeedTest);
document.getElementById('downloadLog').addEventListener('click', downloadLog);

const log = [];

async function testDownloadSpeed() {
    try {
        const startTime = performance.now();
        const response = await fetch('https://speed.hetzner.de/1MB.bin');
        if (!response.ok) throw new Error("Failed to fetch download test file");
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;  // duration in seconds
        const fileSizeMB = 1;  // 1 MB file size
        
        return (fileSizeMB / duration) * 8;  // Convert to Mbps
    } catch (error) {
        console.error("Error during download speed test:", error);
        return 0;
    }
}

async function testUploadSpeed() {
    try {
        const startTime = performance.now();
        const data = new Blob(['a'.repeat(1024 * 1024)]);  // 1 MB of data
        
        const response = await fetch('https://httpbin.org/post', {
            method: 'POST',
            body: data
        });
        
        if (!response.ok) throw new Error("Failed to perform upload test");
        
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;  // duration in seconds
        const fileSizeMB = 1;  // 1 MB file size
        
        return (fileSizeMB / duration) * 8;  // Convert to Mbps
    } catch (error) {
        console.error("Error during upload speed test:", error);
        return 0;
    }
}

async function startSpeedTest() {
    console.log("Running full speed test with progress bar.");

    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    
    // Reset and show progress bar
    progressBar.style.width = '0%';
    progressContainer.style.display = 'block';

    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 100) {
            progress += 10;
            progressBar.style.width = `${progress}%`;
            console.log(`Progress: ${progress}%`);
        }
    }, 200);
    
    // Run speed test and get results
    try {
        const downloadSpeed = await testDownloadSpeed();
        const uploadSpeed = await testUploadSpeed();
        
        // Clear progress interval, set to 100%
        clearInterval(progressInterval);
        progressBar.style.width = '100%';
        
        // Display speed test results in HTML
        document.getElementById('downloadSpeed').textContent = downloadSpeed.toFixed(2);
        document.getElementById('uploadSpeed').textContent = uploadSpeed.toFixed(2);
        document.getElementById('timestamp').textContent = `Timestamp: ${new Date().toLocaleString()}`;

        // Hide progress bar after test is done
        setTimeout(() => {
            progressContainer.style.display = 'none';
        }, 500);
    } catch (error) {
        console.error("Error during speed test:", error);
    }
}

function downloadLog() {
    const logContent = log.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'speed_test_log.txt';
    link.click();
}