- In roles folder -> the logic(for security check) is present
- In roles.guard.ts : checks "Does this user have permission or not?"

- In decorator/ roles.decorators.ts file it lets you write @Roles('admin') on APIs.

Meaning:
"Only admin allowed here"



-----------------Till 16th feb work is done ----------------
currently, I have completed the core backend foundation.
This includes secure user authentication using JWT, role-based access for Admin, Instructor, and Student, and protected APIs.

The login and registration system is fully functional, and users can access features based on their roles.

I have also created the course module, where instructors can create and manage their own courses.
Each course is linked to its instructor, and the system supports draft and publishing workflow.

At this stage, the backend is stable and ready for further scaling.

Right now, I am working on:

Student enrollment system

Progress tracking

Certificate module

Frontend integration and UI improvement

In the next phase, my focus will be on improving user experience and adding analytics features.

I will continue sharing regular updates and welcome any feedback or suggestions. Thank you.”




To made file via terminal :
nest g module folder_name

ex: nest g module certificates
nest g service certificates
nest g controller certificates



To generate a real pdf certificate dynamically 
Install required lib's:

npm install pdf-lib qrcode fs-extra

What each library does:

pdf-lib → writes student name, course, etc. on certificate
qrcode → generates verification QR code
fs-extra → saves certificate file

-> for certificate we first implement a core engine that generates certifictae pdf( Implement certificate.service.ts file)

-> In cert.services.ts file: implement cert generator service

when it calls, it will:
- Load template of cert.
- write student name
- write course name
- write date
- write certId
- generate QR code
- save pdf in /certificates folder
- save cert reccord in mongodb


