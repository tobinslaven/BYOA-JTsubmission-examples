# BYOA JT Submission Examples

A simple, elegant React+Tailwind app that turns any Acton project prompt into two contrast examples—World-Class (✅ greenlit) vs Not Approved (❌)—matched to ES / MS / LP expectations, with the ability to save good comparisons for reuse.

## Features

### Core Functionality
- **Generate Examples**: Paste project directions and get contrast examples for your studio level
- **Studio Levels**: Support for Elementary Studio (ES), Middle Studio (MS), and Launchpad Studio (LP)
- **Save Comparisons**: Save useful examples for future reuse
- **Browse Saved**: Search and filter saved comparisons by studio level

### User Experience
- **Clean Interface**: Modern, responsive design with Tailwind CSS
- **Accessibility**: Keyboard navigation, ARIA roles, and screen reader support
- **Copy Features**: Quick copy buttons for example text and criteria lists
- **Visual Feedback**: Clear ✅/❌ indicators and criteria badges

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BYOA-JTsubmission-examples
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Usage

### For Learners
1. Navigate to the "Create Examples" tab
2. Paste your project directions in the text area
3. Select your studio level (ES/MS/LP)
4. Click "Get Examples" to generate contrast examples
5. Review the World-Class vs Not Approved examples
6. Use the criteria checklist to improve your own submission
7. Optionally save useful comparisons for future reference

### For Guides
1. Use the tool to quickly show level-appropriate exemplars during launches
2. Save comparisons with descriptive titles for reuse
3. Browse saved results to find relevant examples for different projects
4. Use the contrast format to discuss what makes work excellent

## Studio Levels

### Elementary Studio (ES)
- Complete sentences
- Clear goal or objective
- Evidence attached
- Sources cited
- Simple vocabulary and 2-4 sentence blocks

### Middle Studio (MS)
- All ES criteria plus:
- Reflection included
- Quality work standards
- Moderate complexity and deeper thinking

### Launchpad Studio (LP)
- All MS criteria plus:
- Professional tone
- Detailed analysis
- College-level expectations and rigor

## API Structure

The app uses mock API endpoints that can be easily replaced with real backend services:

- `POST /examples/generate` - Generate contrast examples
- `POST /comparisons` - Save a comparison
- `GET /comparisons` - Get saved comparisons with optional filtering
- `GET /comparisons/:id` - Get a specific comparison

## Success Metrics

- 40% reduction in submissions rejected by peers/Guides
- 30% increase in complete criteria coverage in first attempts
- 3+ reuses per week per studio of saved comparisons

## Technology Stack

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Create React App** for build tooling
- **Modern ES6+** features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please contact the development team or create an issue in the repository.