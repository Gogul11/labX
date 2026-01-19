# ORCA - LAN-Based Lab Assessment IDE

A **cross-platform desktop IDE for lab assessments** that works entirely within a **Local Area Network (LAN)**. Teachers can host assessment rooms, collect student project directories, evaluate submissions, assign marks, share reference materials, and communicate via chat — all offline.

Built using **Electron.js, Node.js, React, and TypeScript**.

---

## Developers
- **Gogul** — Backend Developer ([GitHub](https://github.com/Gogul11))
- **Mohan Vishnu Kumar** — Frontend Developer ([GitHub](https://github.com/surrealsun))
- **Sankara Krishnan** — Frontend Developer ([GitHub](https://github.com/SankaraKrishnan12))
- **Gunasekhar** - Frontend Developer ([Github](https://github.com/GUNASEKHAR5))


---

## Features

### Teacher
- Host an assessment room over LAN
- Specify a submission directory for storing student projects
- Receive folder-based submissions automatically
- View submitted projects inside the IDE
- Allocate marks and feedback
- Upload reference documents

### Student
- Join assessment rooms via local network
- Use the IDE as a general-purpose development tool
- Submit the entire project directory
- Download reference materials
- Chat with peers

### Communication
- Real-time LAN-based chat
- Student and Student communication

### Submission System
- Directory-based project submission
- No cloud or external servers
- Stored inside teacher-defined folder

### Cross Platform
- Windows
- Linux
- macOS

---

## Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React + TypeScript |
| Desktop | Electron.js |
| Backend | Node.js |
| Networking | WebSockets (LAN) |
| File Transfer | Local Network Streaming |

---
## Architecture Overview

| Teacher (Host) |
|----------------|
| Node.js LAN Server |
| Submission Directory |
| Chat Server |
| Evaluation Interface |

| Students (Clients) |
| ------------------ |
| IDE Workspace |
| LAN Room Client |
| Directory Submission Module |
| Chat Client |

---

## Flow
### Teacher Flow
- Launch the application
- Host an assessment room
- Select submission directory
- Upload reference materials
- Review submissions and assign marks

### Student Flow

- Join the room via LAN
- Complete the assessment in the IDE
- Submit the project directory
- Download references if needed

---

## Future Enhancements

- Authentication
- Timed assessments
- Plagiarism detection
- Encryption for submissions
  


