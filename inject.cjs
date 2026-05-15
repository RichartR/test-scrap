const fs = require('fs');

const sections = JSON.parse(fs.readFileSync('sections.json', 'utf8'));

let html = fs.readFileSync('index.html', 'utf8');

// Replace contents of each section
const sectionsToReplace = ['sec2', 'sec3', 'sec4', 'sec5', 'sec7'];

for (const secClass of sectionsToReplace) {
    if (sections[secClass]) {
        // Find the block: <div class="sec sec2"> ... </div>
        // Since there might be nested divs, we use a regex or just simple string replacement if we know the boundaries.
        // Given we only have one of each of these classes in our template, we can just replace everything between <div class="sec secX"> and the next <!-- SEC X E -->
        const regex = new RegExp(`(<div class="sec ${secClass}[^>]*>)[\\s\\S]*?(<!-- SEC \\d E -->)`);
        html = html.replace(regex, `$1\n${sections[secClass]}\n      </div>\n      $2`);
    }
}

// We also need to fix the banner images and other things that might use relative paths or things missing domains.
// The original URLs should already be absolute because they have //game.gtimg.cn etc.

fs.writeFileSync('index.html', html);
console.log('index.html updated with dynamic content!');
