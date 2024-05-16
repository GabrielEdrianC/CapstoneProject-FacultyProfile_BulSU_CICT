import React, { useState, useEffect } from 'react';
import FlipPage from 'react-pageflip';
import { txtDB } from '../../firebase';
import Swal from 'sweetalert2';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import 'query' and 'where' from firebase/firestore
import './flipp.css';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import Even5 from './Even5.png';
import Odd5 from './Odd5.png';
import FRONT_IMAGE from './FRONT.png';
import END_IMAGE from './END.png';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCertificate, faPrint, faBook, faGraduationCap, faBriefcase, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import html2pdf from 'html2pdf.js'; // Import html2pdf library
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';



const IconContainer = ({ children }) => <div className="IconContainer">{children}</div>;
const PageContent = ({ children }) => <div className="PageContent">{children}</div>;
const Sidebar = ({ children }) => <div className="Sidebar">{children}</div>;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
`;

const Flipbook = () => {
  const [users, setUsers] = useState([]);
  const [showCertifications, setShowCertifications] = useState(false);
  const [showProfile, setShowProfile] = useState(true);
  const [showResearch, setShowResearch] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('year');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showSortButtons, setShowSortButtons] = useState(false); // Corrected variable name
  const [originalUsers, setOriginalUsers] = useState([]); // Store the original data
  const [filteredUsers, setFilteredUsers] = useState([]); // Store the filtered data
  const frontPage = { isFrontPage: true };
  const endPage = { isEndPage: true };
  const [accordionOpen, setAccordionOpen] = useState(false);



  const handlePrint = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pages = document.querySelectorAll('.page');
  
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
  
      // Capture the entire page, including images
      await html2canvas(page, { scrollY: -window.scrollY })
      .then((canvas) => {
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297);
    
        // Fetch and add imgUrl separately
       
    
        if (i < pages.length - 1) {
          pdf.addPage();
        }
      })
      .catch((error) => {
        console.error('Error capturing flipbook content:', error);
      });
    }
  
    pdf.save('flipbook.pdf');
  };

  const handleAccordionToggle = () => {
    setAccordionOpen(!accordionOpen);
  };

  // Define your getFlipbookData function
  const getFlipbookData = async () => {
    const valRef = collection(txtDB, 'faculty');
  
 const querySnapshot = await getDocs(query(valRef, where('archived', '==', false)));

    const flipbookData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setUsers(flipbookData); // Set the users state with the filtered data
  };
	
  // Call the getFlipbookData function when the component mounts
  useEffect(() => {
    const getFlipbookData = async () => {
      const valRef = collection(txtDB, 'faculty');
      const querySnapshot = await getDocs(query(valRef, where('archived', '==', false)));
      const flipbookData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      const usersWithResearch = await Promise.all(
        flipbookData.map(async (user) => {
          const researchData = await getResearchData(user.id);
          user.research = researchData;
          return user;
        })
      );
      setOriginalUsers(usersWithResearch); // Store the original data
      setFilteredUsers(usersWithResearch); // Initially display all data
      setUsers(usersWithResearch);
    };
  
    getFlipbookData();
  }, []);
  

  const getResearchData = async (facultyId) => {
    const researchCollectionRef = collection(txtDB, 'faculty', facultyId, 'researches');
    const querySnapshot = await getDocs(researchCollectionRef);
    const researchData = [];

    querySnapshot.forEach((doc) => {
      researchData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return researchData;
  };

  const toggleCertifications = () => {
    setShowCertifications(true);
    setShowProfile(false);
    setShowResearch(false);
  };

  const toggleProfile = () => {
    setShowProfile(true);
    setShowCertifications(false);
    setShowResearch(false);
  };

  const toggleResearch = () => {
    setShowResearch(true);
    setShowCertifications(false);
    setShowProfile(false);
  };

  const toggleSortButtons = () => {
    setShowSortButtons(!showSortButtons);
  };

  const handleResearchSort = (criteria) => {
    // Toggle sorting order if the same criteria is selected
    if (criteria === sortCriteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCriteria(criteria);
      setSortOrder('asc');
    }
  };

  const handleFilter = (facultyType) => {
    if (facultyType === '') {
      // If 'ALL' is selected, display all users
      setFilteredUsers(originalUsers);
    } else {
      const filteredData = originalUsers.filter((user) => user.facultyType === facultyType);
      setFilteredUsers(filteredData);
    }
  };  
   
 const pagesArray = [frontPage, ...filteredUsers, endPage];
 

 const generatePDF = async () => {
  const pdfDoc = await PDFDocument.create();

  const pageWidth = 300;
  const pageHeight = 508;

  const margin = 0; // 1/2 inch margin on all sides

  const profileFontSize = 8;
  const certificationFontSize = 5;
  const researchFontSize = 5;

  const lineHeightProfile = profileFontSize * 2;
  const lineHeightCertification = certificationFontSize * 1.2;
  const lineHeightResearch = researchFontSize * 1.2;

  const frontPage = pdfDoc.addPage([pageWidth, pageHeight]);
  const frontImageBytes = await fetch(FRONT_IMAGE).then((response) => response.arrayBuffer());
  const frontImage = await pdfDoc.embedPng(frontImageBytes);
  frontPage.drawImage(frontImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // Create a new page based on the selected view
    let currentPage;
    let currentYPosition;

    if (showProfile) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentYPosition = pageHeight - margin - 20; // Adjust the initial Y position based on your needs
    } else if (showCertifications) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentYPosition = pageHeight - margin - 20; // Adjust the initial Y position based on your needs
    } else if (showResearch) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      currentYPosition = pageHeight - margin - 20; // Adjust the initial Y position based on your needs
    }
   
    // Common logic for all views
    const backgroundImages = [Even5, Odd5];
    const userBackgroundImage = backgroundImages[i % 2];
    const imageBytes = await fetch(userBackgroundImage).then((response) => response.arrayBuffer());
    const image = await pdfDoc.embedPng(imageBytes);
    currentPage.drawImage(image, { x: 0, y: 0, width: pageWidth, height: pageHeight });
    currentPage.margins = { top: margin, left: margin, right: margin, bottom: margin }; // 1/2 inch margin on all sides
    

   

    
    if (showProfile) {

      currentPage.setFontSize(profileFontSize);
      currentPage.setFontColor(rgb(0, 0, 0)); // Set font color to black
      //currentPage.drawImage(`${user.imgUrl}`, { x: margin + 50, y: currentYPosition });
      currentPage.drawText(`${user.name}`, { x: margin + 50, y: currentYPosition });
      currentPage.drawText(`${user.position}`, { x: margin + 50, y: currentYPosition - lineHeightProfile });
      currentPage.drawText(`${user.department}`, { x: margin + 50, y: currentYPosition - lineHeightProfile * 2 });
      currentPage.drawText(`${user.employment}`, { x: margin + 50, y: currentYPosition - lineHeightProfile * 3 });
      user.education.forEach((eduItem, eduIndex) => {
        currentPage.drawText(`• ${eduItem}`, {
          x: margin + 50,
          y: currentYPosition - lineHeightProfile * (4 + eduIndex),
        });
      });
      // Add more profile-related content here
    } else if (showCertifications) {
      currentPage.setFontSize(certificationFontSize);
      currentPage.setFontColor(rgb(0, 0, 0)); // Set font color to black
      currentPage.drawText('CERTIFICATIONS', { x: margin + 50, y: currentYPosition });
      currentYPosition -= lineHeightCertification;
      user.certifications.forEach((certification, certIndex) => {
        // Check if the text will overflow to the next line
        if (currentYPosition - lineHeightCertification < margin) {
          currentPage.addNewLine();
          currentYPosition = pageHeight - margin - lineHeightCertification;
        }
        currentPage.drawText(`• ${certification}`, {
          x: margin + 50,
          y: currentYPosition - lineHeightCertification,
        });
        currentYPosition -= lineHeightCertification;
      });
      // Add more certifications-related content here
    } else if (showResearch) {
      currentPage.setFontSize(researchFontSize);
      currentPage.setFontColor(rgb(0, 0, 0)); // Set font color to black
      currentPage.drawText('RESEARCH', { x: margin + 50, y: currentYPosition });
      currentYPosition -= lineHeightResearch;
      const researchData = user.research || [];
      const sortedResearch = researchData.slice(0);
      sortedResearch.forEach((research, resIndex) => {
        // Check if the text will overflow to the next line
        if (currentYPosition - lineHeightResearch * 3 < margin) {
          currentPage.addNewLine();
          currentYPosition = pageHeight - margin - lineHeightResearch;
        }
        currentPage.drawText(`• Title: ${research.title}`, {
          x: margin + 50,
          y: currentYPosition - lineHeightResearch * (1 + resIndex),
        });
        currentPage.drawText(`  Author: ${research.author && Array.isArray(research.author) ? research.author.join(', ') : ''}`, {
          x: margin + 50,
          y: currentYPosition - lineHeightResearch * (2 + resIndex),
        });
        currentPage.drawText(`  Year: ${research.year}`, {
          x: margin + 50,
          y: currentYPosition - lineHeightResearch * (3 + resIndex),
        });
        currentYPosition -= lineHeightResearch * (3 + resIndex);
      });
      // Add more research-related content here
    }
  }
  // Add END page
  const endPage = pdfDoc.addPage([pageWidth, pageHeight]);
  const endImageBytes = await fetch(END_IMAGE).then((response) => response.arrayBuffer());
  const endImage = await pdfDoc.embedPng(endImageBytes);
  endPage.drawImage(endImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });

  const link = document.createElement('a');
  link.download = 'generated-pdf.pdf';
  link.href = window.URL.createObjectURL(blob);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleSaveAsPDF = () => {
  const element = document.getElementById('flipbook-container'); // Replace with the ID of your Flipbook container
  if (element) {
    console.log('Element found:', element);
    html2pdf(element, {
      margin: 10,
      filename: 'flipbook.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    }).then(() => {
      console.log('PDF saved successfully');
    }).catch((error) => {
      console.error('Error saving PDF:', error);
    });
  } else {
    console.warn('Element not found. Ensure the ID is correct.');
  }
  };


const handleLogoutView = () => {
  Swal.fire({
  
    text: 'Are you sure you want to go back to admin?',
   
    showCancelButton: true,
    confirmButtonText: 'Yes, Move to Admin',
    cancelButtonText: 'No, cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      // Perform server-side logout (invalidate session/token)

      // Remove user token from localStorage
      localStorage.removeItem('userToken');

      // Redirect the user on the client-side
      Swal.fire({
        title: 'Redirecting...',
      }).then(() => {
        // Replace the current page with the home page
        window.location.replace('/add');
      });
    }
  });
};

const handleClick = async () => {
  const result = await Swal.fire({
    title: 'Print PDF?',
    text: 'Do you want to generate and print the PDF?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, print it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    generatePDF();
  } else if (result.dismiss === Swal.DismissReason.cancel) {
    Swal.fire('Cancelled', 'PDF generation was cancelled', 'info');
  }
};
  return (
    <div id="main-container">
      <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <PageContent>
        <Sidebar users={users} setUsers={setUsers}>
        <div className="custom-sidebar-text">
        
        <div className="custom-sidebar-text">
          <h2>CICT FACULTY <br />FLIPBOOK</h2>
        </div>
        </div>
        <div id="sidebar-content">
        <button id="viewflipbtn" onClick={handleLogoutView}>
              ADMIN SIDE
              </button>
        <p id="fType-accordion" onClick={handleAccordionToggle} ><FontAwesomeIcon id="icon" icon={faBriefcase} style={{ fontSize: '1em' }}/>
            Faculty Type  <i className={`fa ${accordionOpen ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
        </p>
        <div className={`w3-hide ${accordionOpen ? 'w3-show' : 'w3-hide'} w3-white w3-card`}>
            <p id="fType" onClick={() => handleFilter('')}>ALL</p>
            <p id="fType" onClick={() => handleFilter('BSIT CORE FACULTY')}>BSIT CORE FACULTY</p>
            <p id="fType" onClick={() => handleFilter('BSIS CORE FACULTY')}>BSIS CORE FACULTY</p>
            <p id="fType" onClick={() => handleFilter('BLIS CORE FACULTY')}>BLIS CORE FACULTY</p>
            <p id="fType" onClick={() => handleFilter('ALLIED CORE FACULTY')}>ALLIED CORE FACULTY</p>
            <p id="fType" onClick={() => handleFilter('PART-TIME FACULTY')}>PART-TIME FACULTY</p>
            <p id="fType" onClick={() => handleFilter('INDUSTRY PRACTITIONERS')}>INDUSTRY PRACTITIONERS</p>
        </div>
        <div>
       
            <p id="facultyProfileButton" onClick={toggleProfile}><FontAwesomeIcon id="icon" icon={faUser} style={{ fontSize: '1em' }} />
              Profile
            </p>
            <p id="certificationsButton" onClick={toggleCertifications}><FontAwesomeIcon id="icon" icon={faCertificate} style={{ fontSize: '1em' }}/>
              Certifications
            </p>
            <p id="researchButton" onClick={() => { toggleResearch(); toggleSortButtons(); }}><FontAwesomeIcon id="icon" icon={faBook} style={{ fontSize: '1em' }}/>
              Research
            </p>
            {showSortButtons && showResearch && ( // Conditionally render sort buttons
                    <div id="sort-container">
                      <button id="yearsort" onClick={() => handleResearchSort('year')}>
                        {sortCriteria === 'year' && sortOrder === 'asc' && '▲'} 
                        {sortCriteria === 'year' && sortOrder === 'desc' && '▼'}
                        Sort by Year
                      </button>
                      <button id="titlesort" onClick={() => handleResearchSort('title')}>
                        {sortCriteria === 'title' && sortOrder === 'asc' && '▲'}
                        {sortCriteria === 'title' && sortOrder === 'desc' && '▼'}
                        Sort by Title 
                      </button>
                    </div>
                  )}
                    <p id="researchButton"  onClick={handlePrint}><FontAwesomeIcon id="icon" icon={faPrint} style={{ fontSize: '1em' }}/>
                       Print</p>
            
        </div>
        </div>
          
          
        
        </Sidebar>


        <MainContent>
          {/* FlipPage content */}
          <div id="flipbook-container"
           className="flipbook-container">
          <FlipPage width={300} height={508}>
            {[...pagesArray.map((page, index) => {
              if (page.isFrontPage || page.isEndPage) {
                return (
                  <div key={index} className={page.isFrontPage ? 'front-page' : 'end-page'} />
                );
              } else {
                const { facultyType, imgUrl, name, position, department, employment, education, certifications, bday, rank  } =filteredUsers[index - 1]; // Assuming users is an array of user data

                const researchData = filteredUsers[index - 1].research || [];
                const sortedResearch = [...researchData]; // Copy of the research array

                sortedResearch.sort((a, b) => {
                  const order = sortOrder === 'asc' ? 1 : -1;

                  if (sortCriteria === 'year') {
                    return order * (a.year - b.year);
                  } else if (sortCriteria === 'title') {
                    return order * a.title.localeCompare(b.title);
                  }

                  return 0;
                });

                return (
                  <div className={`page ${index % 2 === 0 ? 'even-page' : 'odd-page'}`} key={index}>
                    <div id="flip-main-container">
                      <p id="facultyType">{facultyType}</p>
                      <img id="imgicon" src={imgUrl} />
                      <div>
                        <p id="name">{name}</p>
                        <p id="bday"> BIRTH DATE: {bday}</p>
                        <hr id="hr1" />
                        <p id="pos">{position}</p>
                        <p id="pos">{rank}</p>
                        {showProfile && (
                          <div>
                            <p id="dep">
                              <label>DEPARTMENT</label>
                              <br />
                              {department}
                            </p>
                            <p id="emp">
                              <label>EMPLOYMENT</label>
                              <br />
                              {employment}
                            </p>
                            <div>
                              <p id="edu">
                                <label>EDUCATION</label>
                              </p>
                              <ul id="ul-edu">
                                {education.map((item, eduIndex) => (
                                  <li id="li-edu" key={eduIndex}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                        {showCertifications && (
                          <div>
                            <p id="label">CERTIFICATIONS</p>
                            <div id="cert">
                              <ul id="ul-cert" >
                                {certifications.map((certification, certIndex) => (
                                  <li id="li-cert" key={certIndex}>{certification}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                         {showResearch && (
                            <div>
                              <p id="res">RESEARCH</p>
                              <p id="count">Research Count: {sortedResearch.length}</p>
                              <ul id="ul-research">
                              {sortedResearch.length === 0 && (
                                <p id="prompt2">This faculty is yet to publish their research...</p>
                              )}
                                {sortedResearch.map((research, resIndex) => (
                                  <li id="li-research" key={resIndex}>
                                    <p id="label1">
                                      <span id="title">Title: </span>
                                      <a id="research-label" href={research.link} target="_blank" rel="noopener noreferrer">
                                        {research.title}
                                      </a>
                                    </p>
                                    <p id="label1">
                                      <span id="author">Author: </span>
                                      {research.author && Array.isArray(research.author) ? research.author.join(', ') : ''}
                                    </p>
                                    <p id="label1">
                                      <span id="year">Year Published: </span>
                                      {research.year}
                                    </p>
                                    <hr id="hr2" />
                                  </li>
                                ))}
                              </ul>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })]}
          </FlipPage>

          </div>
        </MainContent>
      </PageContent>
    </div>
  );
};

export default Flipbook;