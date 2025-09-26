# DOI to Sci-Hub Redirector

A browser extension that automatically redirects DOI links to Sci-Hub, providing easy access to academic articles with optional PDF downloading.

![Extension Interface](https://github.com/user-attachments/assets/61fdbfd2-586d-420b-a20c-0e52658d9a99)

## 🚀 Features

- **Automatic Redirection**: Seamlessly redirects DOI links to Sci-Hub
- **PDF Downloads**: Optional automatic PDF downloading with custom directory
- **Smart Detection**: Supports multiple academic publishers and DOI formats
- **Toggle Control**: Easy on/off switch for the extension
- **Notification System**: Alerts when articles are not available on Sci-Hub

## 📥 Installation

### Firefox
1. Download the extension files or clone this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the extension directory

### Chrome/Chromium
1. Download the extension files or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory containing `manifest.json`

## 🎯 Usage

### Basic Operation
Once installed, the extension works automatically:

1. **Visit any page with DOI links** - The extension detects and redirects them to Sci-Hub
2. **Click the extension icon** to access settings and controls
3. **Toggle the extension** on/off using the blue button in the popup

### Supported URLs
The extension automatically detects and processes:

- **DOI links**: `https://doi.org/10.1000/example`
- **ScienceDirect**: `https://www.sciencedirect.com/science/article/abs/pii/...`
- **ACS Publications**: `https://pubs.acs.org/doi/abs/10.1000/...`
- **Direct DOI patterns**: Any URL containing DOI format `10.xxxx/...`

### PDF Download Feature
Enable automatic PDF downloads by:

1. Check the "Download Articles" checkbox
2. Specify a custom download directory (default: "SciHubDownloads")
3. PDFs are automatically saved when articles are accessed

## ⚙️ Configuration

The extension popup provides several options:

- **Toggle Button**: Enable/disable the extension
- **Download Articles**: Checkbox to enable automatic PDF downloads
- **Download Directory**: Custom folder name for saved PDFs
- **Debug Info**: Shows current extension status

## 🔧 Technical Details

### Supported Academic Publishers
- DOI-based links from any publisher
- ScienceDirect (Elsevier)
- ACS Publications (American Chemical Society)
- And more through DOI pattern matching

### File Naming Convention
Downloaded PDFs are named using the DOI identifier with slashes replaced by underscores:
- DOI: `10.1000/example.2023` → Filename: `10.1000_example.2023.pdf`

### Browser Permissions
The extension requires these permissions:
- `webRequest` - To intercept and redirect DOI links
- `downloads` - For PDF downloading functionality
- `storage` - To save user preferences
- `notifications` - To alert users about article availability
- `<all_urls>` - To detect DOI links across all websites

## 🛠️ Development

### File Structure
```
DOISciHub/
├── manifest.json     # Extension manifest
├── background.js     # Main extension logic
├── popup.html        # Settings interface
├── popup.js          # Popup functionality
└── README.md         # This file
```

### Key Functions
- **DOI Detection**: Regex patterns for identifying DOI links
- **Sci-Hub Integration**: Automatic redirection and article checking
- **PDF Extraction**: Parsing Sci-Hub responses for direct PDF links
- **Download Management**: Custom directory and filename handling

## 🚨 Important Notice

This extension is for educational and research purposes. Users should:
- Respect copyright laws and terms of service
- Use Sci-Hub in accordance with local regulations
- Consider supporting publishers through legitimate channels when possible

## 📞 Contact & Support

- **Repository**: [https://github.com/JohannesFalk99/DOISciHub](https://github.com/JohannesFalk99/DOISciHub)
- **Issues**: Report bugs or request features via GitHub Issues
- **Developer**: JohannesFalk99

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Setup
```bash
git clone https://github.com/JohannesFalk99/DOISciHub.git
cd DOISciHub
# Load the extension in your browser as described in Installation
```

## 📝 License

This project is open source. Please check the repository for license details.

---

**Disclaimer**: This extension is a third-party tool not affiliated with Sci-Hub or any academic publishers. Use responsibly and in accordance with applicable laws and terms of service.