// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Get references to the interactive elements
    const pulseWidthSlider = document.getElementById("pulse-width");
    const pulseWidthValue = document.getElementById("pulse-width-value");

    const modulationSelect = document.getElementById("modulation");

    const signalPowerSlider = document.getElementById("signal-power");
    const signalPowerValue = document.getElementById("signal-power-value");

    const canvas = document.getElementById("signal-canvas");
    const ctx = canvas.getContext("2d");

    // Default signal properties
    let pulseWidth = parseFloat(pulseWidthSlider.value);
    let modulationType = modulationSelect.value;
    let signalPower = parseFloat(signalPowerSlider.value);

    // Update displayed values and redraw when controls change
    pulseWidthSlider.addEventListener("input", () => {
        pulseWidth = parseFloat(pulseWidthSlider.value);
        pulseWidthValue.textContent = `${pulseWidth} ns`;
        drawSignal();
    });

    modulationSelect.addEventListener("change", () => {
        modulationType = modulationSelect.value;
        drawSignal();
    });

    signalPowerSlider.addEventListener("input", () => {
        signalPower = parseFloat(signalPowerSlider.value);
        signalPowerValue.textContent = `${signalPower} dB`;
        drawSignal();
    });

    // Function to draw the signal based on the current parameters
    function drawSignal() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Set canvas dimensions
        const width = canvas.width;
        const height = canvas.height;

        // Draw signal background
        ctx.fillStyle = "#f3f3f3";
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines for reference
        drawGrid();

        // Draw the UWB signal based on modulation type
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.beginPath();

        if (modulationType === "TH-PPM") {
            drawTHPPMSignal();
        } else if (modulationType === "OFDM-UWB") {
            drawOFDMUWBSymbols();
        } else if (modulationType === "DS-UWB") {
            drawDSUWBSymbols();
        }

        ctx.stroke();
    }

    // Function to draw grid lines on the canvas
    function drawGrid() {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 1;

        const stepX = 50;
        const stepY = 50;

        for (let x = 0; x <= canvas.width; x += stepX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y <= canvas.height; y += stepY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Function to draw TH-PPM UWB signal
    function drawTHPPMSignal() {
        let x = 0;
        const step = 20;

        while (x < canvas.width) {
            ctx.moveTo(x, canvas.height / 2);
            ctx.lineTo(x, canvas.height / 2 - 50 * (signalPower / 100));
            x += step + pulseWidth * 5;
        }
    }

    // Function to draw OFDM-UWB symbols
    function drawOFDMUWBSymbols() {
        let x = 0;
        const step = 40;

        while (x < canvas.width) {
            ctx.moveTo(x, canvas.height / 2);
            ctx.lineTo(x, canvas.height / 2 - 40 * Math.sin(x / 20) * (signalPower / 100));
            x += step;
        }
    }

    // Function to draw DS-UWB symbols
    function drawDSUWBSymbols() {
        let x = 0;
        const step = 15;

        while (x < canvas.width) {
            ctx.moveTo(x, canvas.height / 2);
            ctx.lineTo(x, canvas.height / 2 - 60 * (Math.random() - 0.5) * (signalPower / 100));
            x += step + pulseWidth * 2;
        }
    }

    // Initial draw call
    drawSignal();
});
