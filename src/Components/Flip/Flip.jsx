import React, { useState, useEffect } from 'react';
import FlipPage from 'react-pageflip';
import { txtDB } from '../../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import 'query' and 'where' from firebase/firestore
import './flip.css';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCertificate, faBook, faGraduationCap, faBriefcase, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import cictlogo from './cictlogo.png';


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
        </div>
        </div>
          
          
          
        </Sidebar>


        <MainContent>
          {/* FlipPage content */}
          <div className="flipbook-container">
          <FlipPage width={300} height={508}>
            {[...pagesArray.map((page, index) => {
              if (page.isFrontPage || page.isEndPage) {
                return (
                  <div key={index} className={page.isFrontPage ? 'front-page' : 'end-page'} />
                );
              } else {
                const { facultyType, imgUrl, name, position, department, employment, education, certifications, bday, rank } =filteredUsers[index - 1]; // Assuming users is an array of user data

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