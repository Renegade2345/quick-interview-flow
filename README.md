
# Interview Management System

A modern, iOS-inspired application for managing candidate interviews and tracking recruitment processes with real-time analytics.

![Interview Management System](https://placeholder.pics/svg/800x400/DEDEDE/555555/Interview%20Management%20System)

## 📱 Features

- **Modern iOS-inspired UI**: Clean, intuitive interface following Apple's design principles
- **Candidate Management**: Track and manage candidates throughout the interview process
- **SLA Tracking**: Monitor service-level agreements for candidate communications
- **Analytics Dashboard**: Real-time insights into recruitment metrics and performance
- **File Uploads**: Support for CSV, PDF, and Google Sheets imports of candidate data
- **Role-based Access Control**: Different views and permissions for admins and interviewers
- **Real-time Notifications**: Stay updated on important events and approaching deadlines

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd interview-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🧭 How to Use

### Logging In

1. Use your provided credentials to log in
2. Admin users will see additional options and capabilities
3. Interviewers will see their assigned candidates and related metrics

### Managing Candidates

1. **View Candidates**: The dashboard displays all candidates assigned to you
2. **Add Candidates**: Click the "Add Candidate" button to manually add a candidate
3. **Import Candidates**: Use the file uploader to import candidates via CSV, PDF, or Google Sheets
4. **Update Status**: Track candidates through various stages (initial contact, follow-up, scheduled)
5. **SLA Tracking**: The system automatically highlights candidates approaching or exceeding SLA timelines

### Analytics

1. Navigate to the Analytics page using the navigation menu
2. View detailed statistics on:
   - Candidate status distribution
   - SLA compliance rates
   - Scheduling efficiency
   - Team performance metrics
3. Filter data by date ranges, recruiters, or other parameters
4. Export reports as needed

### Admin Features

1. **User Management**: Add, edit, or remove users
2. **Global Analytics**: View metrics across all team members
3. **System Configuration**: Adjust SLA thresholds and other system settings

## 📊 Dashboard Overview

The main dashboard provides an at-a-glance view of:

- **Key Metrics**: Scheduling rate, pending follow-ups, and recent activity
- **SLA Status**: Visual indicators for candidates at risk of breaching SLAs
- **Candidate List**: Sortable, filterable list of all assigned candidates
- **Quick Actions**: Buttons for common tasks like adding candidates or generating reports

## 📁 File Upload Guide

The system supports multiple file formats for candidate imports:

1. **CSV Files**: Standard format with required columns (name, email, position, etc.)
2. **PDF Resumes**: The system will extract key information from PDFs
3. **Google Sheets**: Link or upload Google Sheets documents with candidate data
4. **Excel Files**: Standard Excel files with candidate information

## 🔒 Security & Privacy

- All data is handled securely with proper authorization checks
- Personally identifiable information is protected
- Role-based access ensures users only see appropriate data

## 🛠️ Technologies

- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for data fetching
- Recharts for data visualization

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

Built with [Lovable](https://lovable.dev).
