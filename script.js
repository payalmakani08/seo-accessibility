
/* =====================================
   WEBWISE — INTERACTIVE FEATURES
===================================== */

const checkerForm = document.getElementById("checkerForm");
const htmlInput = document.getElementById("htmlInput");
const sampleButton = document.getElementById("sampleButton");
const message = document.getElementById("message");
const results = document.getElementById("results");
const resultsList = document.getElementById("resultsList");
const checksCount = document.getElementById("checksCount");
const copyCodeButton = document.getElementById("copyCode");

const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Sample Website</title>
    <meta name="description" content="A sample website with useful information.">
</head>
<body>
    <header>
        <nav aria-label="Main navigation">
            <a href="#main-content">Home</a>
        </nav>
    </header>

    <main id="main-content">
        <h1>Welcome to my website</h1>
        <p>This is a sample webpage.</p>
        <img src="example.jpg" alt="A sample landscape">
        <a href="#about">Learn about us</a>

        <section id="about">
            <h2>About us</h2>
            <p>We share useful information.</p>
        </section>

        <form>
            <label for="email">Email address</label>
            <input id="email" type="email">
        </form>
    </main>

    <footer>
        <p>Thank you for visiting.</p>
    </footer>
</body>
</html>`;

// Load the example HTML
sampleButton.addEventListener("click", function () {
    htmlInput.value = sampleHTML;
    htmlInput.focus();

    message.className = "message-box mt-4";
    message.textContent =
        "Sample loaded! Click Run check to see the results.";
});

// Check the submitted HTML
checkerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const source = htmlInput.value.trim();

    if (!source) {
        showMessage("Please paste some HTML before running the check.", "error");
        results.classList.add("d-none");
        htmlInput.focus();
        return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(source, "text/html");

    const seoChecks = [];
    const accessibilityChecks = [];

    // SEO checks
    seoChecks.push({
        title: "Page title",
        passed: Boolean(doc.querySelector("title")?.textContent.trim()),
        detail: "Add a meaningful, non-empty <title> element inside <head>."
    });

    const description = doc.querySelector(
        'meta[name="description" i]'
    );

    seoChecks.push({
        title: "Meta description",
        passed: Boolean(description?.getAttribute("content")?.trim()),
        detail: "Add a meta description with a useful summary of the page."
    });

    seoChecks.push({
        title: "Main heading",
        passed: Boolean(doc.querySelector("h1")),
        detail: "Include a clear main heading using an <h1> element."
    });

    seoChecks.push({
        title: "Language declaration",
        passed: Boolean(doc.documentElement.getAttribute("lang")?.trim()),
        detail: 'Set a language, for example <html lang="en">.'
    });

    seoChecks.push({
        title: "Mobile viewport",
        passed: Boolean(
            doc.querySelector('meta[name="viewport" i]')
        ),
        detail: "Add the viewport meta tag for mobile-friendly scaling."
    });

    seoChecks.push({
        title: "Semantic page structure",
        passed: Boolean(
            doc.querySelector("main") &&
            doc.querySelector("header") &&
            doc.querySelector("footer")
        ),
        detail: "Use meaningful page landmarks such as header, main and footer."
    });

    // Accessibility checks
    const images = Array.from(doc.querySelectorAll("img"));

    accessibilityChecks.push({
        title: "Image alternative text",
        passed: images.every(img => img.hasAttribute("alt")),
        detail: images.length === 0
            ? "No images were found. If you add images, provide appropriate alt text."
            : "Every image should have an alt attribute. Decorative images can use alt=\"\".",
        neutral: images.length === 0
    });

    const fields = Array.from(
        doc.querySelectorAll("input, select, textarea")
    ).filter(field => !["hidden", "submit", "button", "reset", "image"].includes(
        (field.getAttribute("type") || "").toLowerCase()
    ));

    const labels = Array.from(doc.querySelectorAll("label"));

    const fieldsHaveLabels = fields.every(field => {
        const id = field.id;

        const hasExplicitLabel = id && labels.some(
            label => label.htmlFor === id
        );

        const hasWrappingLabel = field.closest("label");

        const hasAriaLabel = Boolean(
            field.getAttribute("aria-label") ||
            field.getAttribute("aria-labelledby")
        );

        return hasExplicitLabel || hasWrappingLabel || hasAriaLabel;
    });

    accessibilityChecks.push({
        title: "Form field labels",
        passed: fieldsHaveLabels,
        detail: fields.length === 0
            ? "No form fields were found. Add labels whenever you create form controls."
            : "Give each form field an associated label or an accessible name.",
        neutral: fields.length === 0
    });

    const links = Array.from(doc.querySelectorAll("a"));

    const linksHaveText = links.every(link => {
        const text = link.textContent.trim();
        const imageWithAlt = link.querySelector("img[alt]");
        const ariaLabel = link.getAttribute("aria-label");
        const labelledBy = link.getAttribute("aria-labelledby");

        return Boolean(text || imageWithAlt || ariaLabel || labelledBy);
    });

    accessibilityChecks.push({
        title: "Descriptive link names",
        passed: linksHaveText,
        detail: "Links should have a useful text name or an appropriate accessible label."
    });

    accessibilityChecks.push({
        title: "Skip navigation link",
        passed: Boolean(
            doc.querySelector('a[href="#main-content"]')
        ),
        detail: 'Consider adding a skip link such as <a href="#main-content">Skip to content</a>.'
    });

    const buttons = Array.from(doc.querySelectorAll("button"));

    const buttonsHaveNames = buttons.every(button => {
        return Boolean(
            button.textContent.trim() ||
            button.getAttribute("aria-label") ||
            button.getAttribute("aria-labelledby")
        );
    });

    accessibilityChecks.push({
        title: "Named buttons",
        passed: buttonsHaveNames,
        detail: "Buttons should have a clear text name or an appropriate accessible label."
    });

    displayResults(seoChecks, accessibilityChecks);
});

// Display the scores and individual checks
function displayResults(seoChecks, accessibilityChecks) {
    const seoScore = calculateScore(seoChecks);
    const accessibilityScore = calculateScore(accessibilityChecks);

    updateScore(
        "seoScoreLabel",
        "seoProgressBar",
        "seoProgress",
        "seoSummary",
        seoScore
    );

    updateScore(
        "a11yScoreLabel",
        "a11yProgressBar",
        "a11yProgress",
        "a11ySummary",
        accessibilityScore
    );

    const allChecks = [
        ...seoChecks.map(check => ({ ...check, category: "SEO" })),
        ...accessibilityChecks.map(check => ({
            ...check,
            category: "Accessibility"
        }))
    ];

    resultsList.replaceChildren();

    allChecks.forEach(check => {
        const item = document.createElement("div");
        item.className = "result-item";

        const status = document.createElement("span");
        status.className = "result-status " +
            (check.neutral ? "info" : check.passed ? "pass" : "fail");

        status.textContent = check.neutral ? "i" : check.passed ? "✓" : "×";
        status.setAttribute("aria-hidden", "true");

        const content = document.createElement("div");

        const heading = document.createElement("strong");
        heading.textContent = check.title + " · " + check.category;

        const detail = document.createElement("p");
        detail.textContent = check.passed
            ? check.neutral
                ? check.detail
                : "Looks good. " + check.detail
            : check.detail;

        content.append(heading, detail);
        item.append(status, content);
        resultsList.appendChild(item);
    });

    checksCount.textContent = allChecks.length + " checks";

    results.classList.remove("d-none");

    showMessage(
        "Check complete! Review the results below to see what you can improve.",
        "success"
    );

    results.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

// Calculate score using checks that apply to the submitted HTML
function calculateScore(checks) {
    const applicableChecks = checks.filter(check => !check.neutral);

    if (applicableChecks.length === 0) {
        return 100;
    }

    const passed = applicableChecks.filter(check => check.passed).length;

    return Math.round((passed / applicableChecks.length) * 100);
}

// Update one score card
function updateScore(labelId, barId, progressId, summaryId, score) {
    document.getElementById(labelId).textContent = score + "/100";

    const bar = document.getElementById(barId);
    bar.style.width = score + "%";

    document.getElementById(progressId).setAttribute(
        "aria-valuenow",
        score
    );

    const summary = document.getElementById(summaryId);

    if (score >= 80) {
        summary.textContent = "Good start! Keep up the good work.";
    } else if (score >= 50) {
        summary.textContent = "Getting there. A few improvements may help.";
    } else {
        summary.textContent = "Some important checks need your attention.";
    }
}

// Show a friendly message
function showMessage(text, type) {
    message.className = "message-box mt-4";

    if (type) {
        message.classList.add(type);
    }

    message.textContent = text;
}

// Reset results when the form is cleared
checkerForm.addEventListener("reset", function () {
    results.classList.add("d-none");

    message.className = "message-box mt-4";
    message.textContent =
        "Add your HTML and select “Run check” to see your results.";
});

// Copy the semantic HTML example
copyCodeButton.addEventListener("click", async function () {
    const code = document.getElementById("semanticCode").textContent;

    try {
        await navigator.clipboard.writeText(code);
        copyCodeButton.textContent = "Copied ✓";
    } catch (error) {
        // Fallback for browsers where Clipboard API is unavailable
        const temporaryInput = document.createElement("textarea");
        temporaryInput.value = code;
        temporaryInput.style.position = "fixed";
        temporaryInput.style.opacity = "0";

        document.body.appendChild(temporaryInput);
        temporaryInput.select();

        const copied = document.execCommand("copy");
        temporaryInput.remove();

        copyCodeButton.textContent = copied ? "Copied ✓" : "Select code to copy";
    }

    setTimeout(() => {
        copyCodeButton.textContent = "Copy code";
    }, 1800);
});
          
