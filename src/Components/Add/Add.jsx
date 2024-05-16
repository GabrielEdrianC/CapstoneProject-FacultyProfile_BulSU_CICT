import React, { useEffect, useState, useRef } from "react";
import { imgDB, txtDB } from "../../firebase";
import { Link, useNavigate } from 'react-router-dom';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import Swal from 'sweetalert2';
import cictlogo from './cictlogo.png';
import defaultImage from './default.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import './Add.css';

function CRUD() {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [employment, setEmployment] = useState('');
  const [img, setImg] = useState();
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(0);
  const [link, setLink] = useState('');
  const [bday,setBirthday] = useState();
  const [/* research */, setResearch] = useState('');
  const [selectedResearch, setSelectedResearch] = useState('');
  const [editedData, setEditedData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [addResearchModalOpen, setAddResearchModalOpen] = useState(false);
  // const [EditResearchModalOpen, setEditResearchModalOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [researchData, setResearchData] = useState([]); // Initialize researchData state variable
  const [selectedFacultyType, setSelectedFacultyType] = useState('');
  const [otherFacultyType, setOtherFacultyType] = useState('');
  const [selectedRank, setSelectedRank] = useState('INSTRUCTOR I');
  const [uploadedImageURL, setUploadedImageURL] = useState(defaultImage);
  const fileInputRef = useRef(null);
  

  // State for dynamic Author, Certification and Education input fields
  const [certificationsFields, setCertificationsFields] = useState(['']);
  const [educationFields, setEducationFields] = useState(['']);
  const [author, setAuthor] = useState(['']);
  const [researchCount, setResearchCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const filteredUnarchivedData = filteredData.filter(value => !value.archived);
  const filteredArchivedData = filteredData.filter(value => value.archived);
  
  const handleAccordionToggle = () => {
    setAccordionOpen(!accordionOpen);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Filter data based on the search term
    const filtered = data.filter((value) => value.name.toLowerCase().includes(term.toLowerCase()));
    setFilteredData(filtered);
  };

  const filterDataByFacultyType = (facultyType) => {
    let filteredType;
    if (facultyType === 'ALL') {
      // Show all data when 'ALL' is selected
      filteredType = data;
    } else {
      // Filter data based on facultyType
      filteredType = data.filter((value) => value.facultyType === facultyType);
    }
    setFilteredData(filteredType);
  };
  

    // Function to handle changes in Author input fields
  const handleAuthorChange = (e, index) => {
    const updatedAuthors = [...author];
    updatedAuthors[index] = e.target.value;
    setAuthor(updatedAuthors);
  };

  // Function to add a new Author field
  const addAuthorField = () => {
    setAuthor([...author, '']);
  };

  // Function to remove an Author field by index
  const removeAuthorField = (index) => {
    if (author.length > 1) {
      const newAuthors = [...author];
      newAuthors.splice(index, 1);
      setAuthor(newAuthors);
    }
  };

 // Function to add a new Education field
  const addEducationField = () => {
    // Check if educationFields is an array before updating it
    if (Array.isArray(educationFields)) {
      setEducationFields([...educationFields, '']);
    }
  };

   // Function to handle changes in Education input fields
   const handleEducationChange = (e, index) => {
    // Check if educationFields is an array before updating it
    if (Array.isArray(educationFields)) {
      const updatedEducation = [...educationFields];
      updatedEducation[index] = e.target.value;
      setEducationFields(updatedEducation);
    }
  };


  // Function to remove the last Education field
  const removeEducationField = () => {
    // Check if educationFields is an array before updating it
    if (Array.isArray(educationFields) && educationFields.length > 1) {
      const newFields = [...educationFields];
      newFields.pop();
      setEducationFields(newFields);
    }
  };

  // Function to add a new Certification field
  const handleCertificationsChange = (e, index) => {
    // Check if certificationsFields is an array before updating it
    if (Array.isArray(certificationsFields)) {
      const updatedCertifications = [...certificationsFields];
      updatedCertifications[index] = e.target.value;
      setCertificationsFields(updatedCertifications);
    }
  };

  // Function to add a new Certification field
  const addCertificationField = () => {
    // Check if certificationsFields is an array before updating it
    if (Array.isArray(certificationsFields)) {
      setCertificationsFields([...certificationsFields, '']);
    }
  };

  // Function to remove the last Certification field
  const removeCertificationField = () => {
    // Check if certificationsFields is an array before updating it
    if (Array.isArray(certificationsFields) && certificationsFields.length > 1) {
      const newFields = [...certificationsFields];
      newFields.pop();
      setCertificationsFields(newFields);
    }
  };

  const handleAddResearch = () => {
    if (selectedItem) {
      const facultyMemberId = selectedItem.id;
      const researchCollectionRef = collection(txtDB, 'faculty', facultyMemberId, 'researches');
      const newResearchItem = {
        title: title,
        author: author.filter(author => author.trim() !== ''), // Filter out empty author fields
        year: year,
        link: link,
      };
  
      addDoc(researchCollectionRef, newResearchItem)
        .then(() => {
          setTitle('');
          setAuthor(['']); // Reset authors to one empty field
          setYear(0);
          setLink('');
          closeAddResearchModal();
        })
        .catch((error) => {
          console.error('Error adding research item: ', error);
        });
    }
  };
   
  const handleDeleteResearch = (research) => {
    // You need to implement the logic to delete the research data from Firebase here.
    // Here's an example using Firebase's deleteDoc function:
    const facultyMemberId = selectedItem.id; // Assuming you have the faculty member's ID
    const researchId = research.id; // Assuming you have the research document ID
  
    const researchCollectionRef = collection(txtDB, 'faculty', facultyMemberId, 'researches');
    const researchDocRef = doc(researchCollectionRef, researchId);
  
    // Use the deleteDoc function to delete the research document
    deleteDoc(researchDocRef)
      .then(() => {
        // Handle success (you can also update the UI accordingly)
        console.log('Research deleted successfully.');
      })
      .catch((error) => {
        // Handle errors
        console.error('Error deleting research:', error);
      });
  };

  const openAddResearchModal = (research) => {
    setSelectedResearch(research);
    setAddResearchModalOpen(true);
  };

  const closeAddResearchModal = () => {
    setAddResearchModalOpen(false);
  };

  const openResearchModal = (research) => {
    setSelectedResearch(research);
    setResearchModalOpen(true);
  };

  const closeResearchModal = () => {
    setResearchModalOpen(false);
  };

  // const openEditResearchModal = async (research) => {
  //   setSelectedResearch(research);
  
  //   if (selectedItem) {
  //     const facultyId = selectedItem.id;
  //     const researchData = await getResearchData(facultyId);
  
  //     // Now you have the research data and can display it in your modal
  //     // Set the state to populate the modal fields with the existing data
  //     setTitle(research.title);
  //     setAuthor(research.author);
  //     setYear(research.year);
  //     setLink(research.link);
  //   }
  
  //   setEditResearchModalOpen(true);
  // };

  // const closeEditResearchModal = () => {
  //   setEditResearchModalOpen(false);
  // };

  const openItemModal = (value) => {
    setSelectedItem(value);
  };

  const closeItemModal = (value) => {
    setSelectedItem(value);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadedImageURL(defaultImage); // Clear the uploaded image URL
    setEducationFields(['']); // Reset educationFields with an empty array
    setCertificationsFields(['']); // Reset certificationsFields with an empty array

  };

  const openEditModal = (value) => {
    setEditedData(value);
    // Set the state with the data of the item to be edited
    setName(value.name || '');
    setPosition(value.position || '');
    setDepartment(value.department || '');
    setEmployment(value.employment || '');
    setEducationFields(value.education || ['']); // Set educationFields with fetched data or an empty array
    setCertificationsFields(value.certifications || ['']); // Set certificationsFields with fetched data or an empty array
    setTitle(value.title || ''); // Populate "Title" with the selected data
    setAuthor(value.author || ['']); // Populate "Author" with the selected data
    setYear(value.year || 0); // Populate "Year" with the selected data
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUploadedImageURL(defaultImage); // Clear the uploaded image URL
  };

  const clearInputs = () => {
    setName('');
    setPosition('');
    setDepartment('');
    setEmployment('');
    setEducationFields(['']); // Set it as an empty array
    setCertificationsFields(['']);// Set it as an empty array
    setBirthday('');
  };

  const handleUpload = (e) => {
    const imgs = ref(imgDB, `Imgs/${v4()}`);
      uploadBytes(imgs, e.target.files[0]).then(data => {
        getDownloadURL(data.ref).then(val => {
          setImg(val);
          setUploadedImageURL(val); // Set the uploaded image URL here
      });
    })
    .catch((error) => {
      console.error('Error uploading image: ', error);
    });
  };

  const handleClick = async () => {
    if (!bday || !name || !department || !employment || !educationFields || !certificationsFields || !img) {
      // Check if any of the required fields is empty
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all fields before adding data.',
        icon: 'error',
      });
    } else if (educationFields.some(education => education.trim() === '')) {
      // Check if any education field is empty
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all education fields before adding data.',
        icon: 'error',
      });
    } else if (certificationsFields.some(certification => certification.trim() === '')) {
      // Check if any certification field is empty
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all certification fields before adding data.',
        icon: 'error',
      });
    } else {
      // All fields are filled, proceed with data addition
      const valRef = collection(txtDB, 'faculty');
      const certificationsArray = certificationsFields.filter(certification => certification !== '');
      const educationArray = educationFields.filter(education => education !== '');
      const facultyDocRef = await addDoc(valRef, {
        bday: bday,
        name: name,
        position: position,
        department: department,
        employment: employment,
        education: educationArray,
        certifications: certificationsArray,
        facultyType: selectedFacultyType,
        rank: selectedRank,
        archived: false,
        imgUrl: img
      });
      // Add research data to the "Research" subcollection
      const facultyId = facultyDocRef.id;
      Swal.fire({
        title: 'Data Added',
        text: 'Data added successfully!',
        icon: 'success',
      });
    }
  };
  
  const updateUser = async (id) => {
    if (!bday || !img) {
      // Check if any of the required fields is empty
      Swal.fire({
        title: 'Error',
        text: 'Please fill in all fields before adding data.',
        icon: 'error',
      });
    } 
    if (typeof bday === 'undefined') {
      // Handle the case where bday is undefined (set a default value or show an error message)
      Swal.fire({
        title: 'Error',
        text: 'Please provide a valid birthday.',
        icon: 'error',
      });
      return;
    }
    if (typeof img === 'undefined') {
      // Handle the case where img is undefined (set a default value or show an error message)
      Swal.fire({
        title: 'Error',
        text: 'Please provide a Faculty Image.',
        icon: 'error',
      });
      return;
    }else if (!editedData) {
      return;
    }
  
    const userDoc = doc(txtDB, 'faculty', id);
    const newInfo = {
      bday: bday,
      name: name,
      position: position,
      department: department,
      employment: employment,
      education: educationFields,
      certifications: certificationsFields,
      facultyType: selectedFacultyType,
      rank: selectedRank,
      imgUrl: img 
    };
  
    await updateDoc(userDoc, newInfo);
    clearInputs();
    setIsEditModalOpen(false);
    setDataLoaded(false);
  };

  const handleFacultyTypeChange = (e) => {
    const selectedValue = e.target.value;
    console.log('Selected Faculty Type:', selectedValue);

    // If the selected value is 'OTHER', clear the otherFacultyType state
    if (selectedValue === 'OTHER') {
      console.log('Clearing Other Faculty Type');
      setOtherFacultyType('');
    }

    setSelectedFacultyType(selectedValue);
  };

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
  
  const getData = async () => {
    const valRef = collection(txtDB, 'faculty');
    const dataDb = await getDocs(valRef);
    const allData = dataDb.docs.map(val => ({ ...val.data(), id: val.id }));
    setData(allData);
    setDataLoaded(true);
  };

  const countResearchByFacultyId = (facultyId) => {
    // Filter research data based on faculty ID
    const filteredResearch = researchData.filter(research => research.facultyId === facultyId);
  
    // Return the count of research items
    return filteredResearch.length;
  };

  // const deleteUser = async (id) => {
  //   const userDoc = doc(txtDB, 'faculty', id);
  //   await deleteDoc(userDoc);
  //   clearInputs();
  //   setDataLoaded(false);
  // };

  const archiveUser = async (id, archived) => {
    const userDocRef = doc(txtDB, 'faculty', id);
    const updateData = {
      archived,
    };
  
    try {
      await updateDoc(userDocRef, updateData);
      Swal.fire({
        title: archived ? 'Archived' : 'Unarchived',
        text: `Data has been ${archived ? 'archived' : 'unarchived'} successfully!`,
        icon: 'success',
      });
    } catch (error) {
      console.error(`Error ${archived ? 'archiving' : 'unarchiving'} data:`, error);
    }
  };
  
  useEffect(() => {
    if (!dataLoaded) {
      getData();
    }
    if (researchModalOpen && selectedResearch !== null) {
      // Count the displayed research
      const displayedResearchCount = researchData.length;

      // Update the state with the count
      setResearchCount(displayedResearchCount);
    }
    if (researchModalOpen && selectedItem !== null) {
      const facultyMemberId = selectedItem.id;
      getResearchData(facultyMemberId)
        .then((researchData) => {
          setResearchData(researchData);
        })
        .catch((error) => {
          console.error('Error fetching research data: ', error);
        });
    }
    if (searchTerm.trim() === '') {
      setFilteredData(data); // Show all data when there is no search term
    } else {
      // Filter the data based on the search term
      const filtered = data.filter((value) =>
        value.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [dataLoaded,researchModalOpen, selectedItem, selectedResearch, researchData, searchTerm, data]);

  

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to log out.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform server-side logout (invalidate session/token)
  
        // Remove user token from localStorage
        localStorage.removeItem('userToken');
  
        // Redirect the user on the client-side
        Swal.fire({
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          icon: 'success',
        }).then(() => {
          window.location.replace('/login');
        });
      }
    });
  };
  
  const handleLogoutView = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to switch to Flipbook Page.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Move to Flipbook Page',
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
          window.location.replace('/flipadmin');
        });
      }
    });
  };
  
  

  return (
    <div className="custom-container">
       <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <div className="custom-sidebar">
        <img src={cictlogo} alt="Sidebar Image" id="CustomAdminicon_sidebar" />
        <div className="custom-sidebar-text">
          <h3>CICT FACULTY <br />(ADMIN)</h3>
        </div>
          <button className="facultyArch" onClick={() => setShowArchived(false)}>Faculty</button>
          <button className="archive" onClick={() => setShowArchived(true)}>Archived</button>
        <p id="fType-accordion" onClick={handleAccordionToggle} ><FontAwesomeIcon id="icon" icon={faBriefcase} style={{ fontSize: '1em' }}/>
            Faculty Type  <i className={`fa ${accordionOpen ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
          </p>
          <div className={`w3-hide ${accordionOpen ? 'w3-show' : 'w3-hide'} w3-white w3-card`}>
              <p id="fType" onClick={() => filterDataByFacultyType('ALL')}>ALL</p>
              <p id="fType" onClick={() => filterDataByFacultyType('BSIT CORE FACULTY')}>BSIT CORE FACULTY</p>
              <p id="fType" onClick={() => filterDataByFacultyType('BSIS CORE FACULTY')}>BSIS CORE FACULTY</p>
              <p id="fType" onClick={() => filterDataByFacultyType('BLIS CORE FACULTY')}>BLIS CORE FACULTY</p>
              <p id="fType" onClick={() => filterDataByFacultyType('ALLIED CORE FACULTY')}>ALLIED CORE FACULTY</p>
              <p id="fType" onClick={() => filterDataByFacultyType('PART-TIME FACULTY')}>PART-TIME FACULTY</p>
              <p id="fType" onClick={() => filterDataByFacultyType('INDUSTRY PRACTITIONERS')}>INDUSTRY PRACTITIONERS</p>
          </div>
        <div className="custom-button-container">
            <div>
              <button id="viewflipbtn" onClick={handleLogoutView}>
               VIEW FLIPBOOK
              </button>
            </div>

            <div>
              <button id="logoutbtn" onClick={handleLogout}>
                LOG OUT
              </button>
            </div>
        </div>
      </div>

      <div className="custom-main-content">
        
        <div id="addfaculty">
          <button id="addfacultybtn" onClick={openModal}>
            ADD FACULTY
          </button>
          <br/>
          {/* Search input field */}
          <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearchChange} />
        </div>
    
        <div>
          {/* Display filtered data in the grid */}
          <div>
            {showArchived ? (
              <div className="scrollable-archived-container">
                <div className="grid-container">
                  {filteredArchivedData.length !== 0 ? (
                    filteredArchivedData.map(value => (
                      <div
                        className={`div-icon ${value.archived ? 'archived' : ''}`}
                        key={value.id}
                        onClick={() => openItemModal(value)}
                      >
                        <img src={value.imgUrl} height="300px" width="300px" alt={value.name} />
                        <h1>{value.name}</h1>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p id="search-message">No archived faculty yet...</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="scrollable-unarchived-container">
                <div className="grid-container">
                  {filteredUnarchivedData.length !== 0 ? (
                    filteredUnarchivedData.map(value => (
                      <div
                        className={`div-icon ${value.archived ? 'archived' : ''}`}
                        key={value.id}
                        onClick={() => openItemModal(value)}
                      >
                        <img src={value.imgUrl} height="300px" width="300px" alt={value.name} />
                        <h1>{value.name}</h1>
                      </div>
                    ))
                  ) : (
                    <div>
                      <p id="search-message">No unarchived faculty yet...</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div id="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <table>
                <tbody>
                  <tr>
                    <th id="title"> 
                    <p className="modal-title">
                      <span className="thclose" onClick={() => openItemModal(null)}>
                        &times;
                      </span>
                      PROFILE
                    </p>
                    </th>
                  </tr>
                  <tr>
                    <td>
                    <div className="modal-details">
                      <img src={selectedItem.imgUrl} alt="Selected Image" />
                      <p><strong>{selectedItem.facultyType}</strong></p>
                      <p><strong>Birth Date:</strong> {selectedItem.bday}</p>
                      <p><strong>Name:</strong> {selectedItem.name}</p>
                      <p><strong>Designation:</strong> {selectedItem.position}</p>
                      <p><strong>Rank:</strong> {selectedItem.rank}</p>
                      <p><strong>Department:</strong> {selectedItem.department}</p>
                      <p><strong>Employment Status:</strong> {selectedItem.employment}</p>
                      <p><strong>Educational Attainment:</strong></p>
                      <ul id="ul-add"  className="cert-scroll">
                        {Array.isArray(selectedItem.education) ? (
                          selectedItem.education.map((education, index) => (
                            <li id="li-add" key={index}>{education}</li>
                          ))
                        ) : (
                          <li>No education data</li>
                        )}
                      </ul>
                      <p><strong>Certifications:</strong></p>
                      <ul id="ul-add" className="cert-scroll">
                        {Array.isArray(selectedItem.certifications) ? (
                          selectedItem.certifications.map((certification, index) => (
                            <li id="li-add" key={index}>{certification}</li>
                          ))
                        ) : (
                          <li id="li-add">No certification data</li>
                        )}
                      </ul>
                    </div>
                    <button id="viewbtn" onClick={() => openResearchModal(selectedItem.research)}>
                      VIEW RESEARCH
                    </button>
                    <button id="editbtn" onClick={() => openEditModal(selectedItem)}>
                      EDIT
                    </button>
                    <button id="archiveButton" onClick={() => {archiveUser(selectedItem.id, !selectedItem.archived);closeItemModal();
                      }}>
                      {selectedItem.archived ? 'UNARCHIVE' : 'ARCHIVE'}
                    </button>
                    </td>
                  </tr>
                </tbody>
              </table>   
            </div>
          </div>
         
        </div>
      )}

      {isModalOpen && (
          <div className="add-modal-overlay">
            <div className="add-modal">
              <div className="custom-modal"  style={{ maxHeight: '100vh', overflow: 'auto' }}>
              {uploadedImageURL && (
                <img id="img-show" src={uploadedImageURL} alt="Uploaded Image" style={{maxWidth: '150px', maxHeight: '150px' }} />
              )}
              <input id="Input-img" type="file" onChange={(e) => handleUpload(e)} ref={fileInputRef} />
              <input id="Input" type="date" placeholder="Birthday...." onChange={(e) => setBirthday(e.target.value)} value={bday || 'N/A'}/>
                  <label>Faculty Type:</label>
                  <select value={selectedFacultyType} onChange={(e) => handleFacultyTypeChange(e)}>
                    <option value="BSIT CORE FACULTY">BSIT CORE FACULTY</option>
                    <option value="ALLIED CORE FACULTY">ALLIED CORE FACULTY</option>
                    <option value="BSIS CORE FACULTY">BSIS CORE FACULTY</option>
                    <option value="BLIS CORE FACULTY">BLIS CORE FACULTY</option>
                    <option value="PART-TIME FACULTY">PART-TIME FACULTY</option>
                    <option value="INDUSTRY PRACTITIONERS">INDUSTRY PRACTITIONERS</option>
                    <option value="OTHER">OTHER</option>
                  </select>

                  {selectedFacultyType === 'OTHER' && (
                    <div>
                      <label>Enter Other Faculty Type:</label>
                      <input type="text" value={otherFacultyType} onChange={(e) => setOtherFacultyType(e.target.value)} />
                    </div>
                  )}
                  <label>Rank:</label>
                  <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
                    <option value="INSTRUCTOR I">INSTRUCTOR I</option>
                    <option value="INSTRUCTOR II">INSTRUCTOR II</option>
                    <option value="INSTRUCTOR III">INSTRUCTOR III</option>
                    <option value="ASSISTANT PROFESSOR I">ASSISTANT PROFESSOR I</option>
                    <option value="ASSISTANT PROFESSOR II">ASSISTANT PROFESSOR II</option>
                    <option value="ASSISTANT PROFESSOR III">ASSISTANT PROFESSOR III</option>
                    <option value="ASSISTANT PROFESSOR IV">ASSISTANT PROFESSOR IV</option>
                    <option value="ASSOCIATE PROFESSOR I">ASSOCIATE PROFESSOR I</option>
                    <option value="ASSOCIATE PROFESSOR II">ASSOCIATE PROFESSOR II</option>
                    <option value="ASSOCIATE PROFESSOR III">ASSOCIATE PROFESSOR III</option>
                    <option value="ASSOCIATE PROFESSOR IV">ASSOCIATE PROFESSOR IV</option>
                    <option value="ASSOCIATE PROFESSOR V">ASSOCIATE PROFESSOR V</option>
                    <option value="PROFESSOR I">PROFESSOR I</option>
                    <option value="PROFESSOR II">PROFESSOR II</option>
                    <option value="PROFESSOR III">PROFESSOR III</option>
                    <option value="PROFESSOR IV">PROFESSOR IV</option>
                    <option value="PROFESSOR V">PROFESSOR V</option>
                    <option value="PROFESSOR VI">PROFESSOR VI</option>
                    <option value=""></option>
                  </select>
                <input id="Input" placeholder="Name...." onChange={(e) => setName(e.target.value)} />
                <input id="Input" placeholder="Designation...." onChange={(e) => setPosition(e.target.value)} />
                <input id="Input" placeholder="Department...." onChange={(e) => setDepartment(e.target.value)} />
                <input id="Input" placeholder="Employment Status....." onChange={(e) => setEmployment(e.target.value)} />
                <div style={{ maxHeight: '50vh', overflow: 'scroll' }}>
                {educationFields.map((value, index) => (
                  <div key={index}>
                    <input id="input-div" placeholder={`Educational Attainment #${index + 1}....`} onChange={(e) => handleEducationChange(e, index)} value={value} />
                    <button id="addbutton" onClick={addEducationField}>+</button>
                    <button id="minusbutton" onClick={() => removeEducationField(index)}>-</button>
                  </div>
                ))}
                {certificationsFields.map((value, index) => (
                  <div key={index}>
                    <input
                      id="input-div"
                      placeholder={`Certification #${index + 1}....`}
                      onChange={(e) => handleCertificationsChange(e, index)}
                      value={value || "This data is yet to be added..."}
                      onClick={(e) => e.target.select()} // This line makes the text auto-select on click
                    />
                    <button id="addbutton" onClick={addCertificationField}>+</button>
                    <button id="minusbutton" onClick={() => removeCertificationField(index)}>-</button>
                  </div>
                ))}


                </div>    
                <div id="type">
                  
                </div>
                <div id="btn-container">
                  <button id="addbtn" onClick={() => { handleClick();}}>
                    ADD
                  </button>
                  <button id="closebtn" onClick={() => { closeModal(); }}>
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}

      {isEditModalOpen && editedData && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="custom-modal">
              <table id="edit-table">
                <tbody>
                  <tr>
                    <th id="title"> 
                      <p className="modal-title">EDIT</p>
                    </th>
                  </tr>
                  <tr>
                    <td>
                      {uploadedImageURL && (
                        <img id="img-show" src={uploadedImageURL} alt="Uploaded Image" style={{maxWidth: '150px', maxHeight: '150px' }} />
                      )}
                      <input id="input-edit" type="file" onChange={(e) => handleUpload(e)}/> 
                      <input id="input-edit" type="date"  onChange={(e) => setBirthday(e.target.value)} value={bday}/> 
                      <input id="input-edit" placeholder="Name...." onChange={(e) => setName(e.target.value)} value={name} />
                      <input id="input-edit" placeholder="Designation...." onChange={(e) => setPosition(e.target.value)} value={position} />
                      <input id="input-edit" placeholder="Department...." onChange={(e) => setDepartment(e.target.value)} value={department} />
                      <input id="input-edit" placeholder="Employment Status....." onChange={(e) => setEmployment(e.target.value)} value={employment} />
                      <div id="scrollable-list">
                      <p><strong>EDUCATION</strong></p>
                      {educationFields.map((value, index) => (
                        <div key={index}>
                            <input id="input-div" 
                            placeholder={`Educational Attainment #${index + 1}....`}
                            onChange={(e) => handleEducationChange(e, index)}
                            onClick={(e) => e.target.select()}
                            value={value}
                            />
                            <button id="addbutton" onClick={addEducationField}>+</button>
                            <button id="minusbutton" onClick={() => removeEducationField(index)}>-</button>
                        </div>
                        ))}
                        <p><strong>CERTIFICATION</strong></p>
                        {certificationsFields.map((value, index) => (
                        <div  key={index}>
                            <input  id="input-div"
                            placeholder={`Certification #${index + 1}....`}
                            onChange={(e) => handleCertificationsChange(e, index) } 
                            onClick={(e) => e.target.select()}
                            value={value}
                            />
                            <button id="addbutton" onClick={addCertificationField}>+</button>
                            <button id="minusbutton" onClick={() => removeCertificationField(index)}>-</button>
                        </div>
                        ))}
                      </div> 
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <label>Rank:</label><br/>
                  <select value={selectedRank} onChange={(e) => setSelectedRank(e.target.value)}>
                    <option value="INSTRUCTOR I">INSTRUCTOR I</option>
                    <option value="INSTRUCTOR II">INSTRUCTOR II</option>
                    <option value="INSTRUCTOR III">INSTRUCTOR III</option>
                    <option value="ASSISTANT PROFESSOR I">ASSISTANT PROFESSOR I</option>
                    <option value="ASSISTANT PROFESSOR II">ASSISTANT PROFESSOR II</option>
                    <option value="ASSISTANT PROFESSOR III">ASSISTANT PROFESSOR III</option>
                    <option value="ASSISTANT PROFESSOR IV">ASSISTANT PROFESSOR IV</option>
                    <option value="ASSOCIATE PROFESSOR I">ASSOCIATE PROFESSOR I</option>
                    <option value="ASSOCIATE PROFESSOR II">ASSOCIATE PROFESSOR II</option>
                    <option value="ASSOCIATE PROFESSOR III">ASSOCIATE PROFESSOR III</option>
                    <option value="ASSOCIATE PROFESSOR IV">ASSOCIATE PROFESSOR IV</option>
                    <option value="ASSOCIATE PROFESSOR V">ASSOCIATE PROFESSOR V</option>
                    <option value="PROFESSOR I">PROFESSOR I</option>
                    <option value="PROFESSOR II">PROFESSOR II</option>
                    <option value="PROFESSOR III">PROFESSOR III</option>
                    <option value="PROFESSOR IV">PROFESSOR IV</option>
                    <option value="PROFESSOR V">PROFESSOR V</option>
                    <option value="PROFESSOR VI">PROFESSOR VI</option>
                    <option value=""></option>
                  </select><br/>
                <label>Faculty Type:</label>  <br/>
                   <select value={selectedFacultyType} onChange={(e) => setSelectedFacultyType(e.target.value)}>
                  <option value="BSIT CORE FACULTY">BSIT CORE FACULTY</option>
                  <option value="ALLIED CORE FACULTY">ALLIED CORE FACULTY</option>
                  <option value="BSIS CORE FACULTY">BSIS CORE FACULTY</option>
                  <option value="BLIS CORE FACULTY">BLIS CORE FACULTY</option>
                  <option value="PART-TIME FACULTY">PART-TIME FACULTY</option>
                  <option value="INDUSTRY PRACTITIONERS">INDUSTRY PRACTITIONERS</option>
                  </select>
              </div>
              <div id="btn-container">
              <button id="confirmbtn" onClick={() => updateUser(editedData.id)}>
                Confirm
              </button>
              <button id="closebtn" onClick={closeEditModal}>
                Close
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {researchModalOpen && selectedResearch !== null && (
        <div className="research-modal-overlay">
          <div className={`research-modal ${researchModalOpen ? 'open' : ''}`}>
            <div className="research-modal-content">
              <div className="scrollable-table">
                <table id="research-table">
                  <tbody>
                    <tr>
                      <th id="title">
                        <p className="modal-title">
                          <span className="thclose" onClick={() => closeResearchModal()}>
                            &times;
                          </span>
                          RESEARCH
                        </p>
                      </th>
                    </tr>
                    <tr>
                      <td>
                        <div className="modal-details">
                          <button id="addresearch-button" onClick={openAddResearchModal}>
                            Add Research
                          </button>
                          <p>Total Research: {researchCount}</p>
                          <div id="research-list" className="table-wrapper">
                            {researchData.length === 0 ? (
                              <p id="prompt">"This Researcher is yet to publish...."</p>
                            ) : (
                              <table className="research-table">
                                <thead>
                                  <tr>
                                    <th>TITLE</th>
                                    <th>AUTHOR</th>
                                    <th>YEAR PUBLISHED</th>
                                    <th>ACTIONS</th> {/* Add a new column for buttons */}
                                  </tr>
                                </thead>
                                <tbody>
                                  {researchData.map((research) => (
                                    <tr key={research.id} className="research-item">
                                      <td>
                                        <a id="research-label" href={research.link} target="_blank" rel="noopener noreferrer">
                                          {research.title}
                                        </a>
                                      </td>
                                      <td>{research.author ? research.author.join(', ') : ''}</td>
                                      <td>{research.year}</td>
                                      <td>
                                        {/* <button id="editresearch-button" onClick={openEditResearchModal}>
                                        Edit
                                        </button> */}
                                        <button id="researchdeletebtn" onClick={() => handleDeleteResearch(research)}>
                                          DELETE
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                 
                              </table>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {addResearchModalOpen && (
        <div className="add-modal-overlay">
          <div className="add-modal">
            <div className="custom-modal">
              <table>
                 <tbody>
                 <tr>
                    <th>
                    <p className="modal-title">
                    <span className="thclose" onClick={closeAddResearchModal}>
                      &times;
                    </span>
                    ADD RESEARCH
                    </p>
                    </th>
                  </tr>
                  <tr>
                    <td>
                    <div className="modal-details">
                        <input id="Input"
                          placeholder="Title...."
                          onChange={(e) => setTitle(e.target.value)}
                        /><br />
                        <div id="btn-container">
                          <label>Authors:</label>
                          <div id="scrollable-list">
                            {author.map((value, index) => (
                              <div key={index} id="btn-container">
                                <input  id="input-div"
                                  placeholder={`Author #${index + 1}....`}
                                  value={value}
                                  onChange={(e) => handleAuthorChange(e, index)}
                                />
                                {index === author.length - 1 && ( // Display "+" button for the last author field
                                  <button id="addbutton" onClick={addAuthorField}>+</button>
                                )}
                                {index !== 0 && ( // Display "-" button for all but the first author field
                                  <button id="minusbutton" onClick={() => removeAuthorField(index)}>-</button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        <input id="Input"
                          placeholder="Year...."
                          onChange={(e) => setYear(e.target.value)}
                        /><br />
                        <input id="Input"
                          placeholder="Link...."
                          onChange={(e) => setLink(e.target.value)}
                        /><br />
                        
                      </div>
                    </td>
                  </tr>
                  <div id="btn-container">
                    <button id="addbtn" onClick={handleAddResearch}>
                        Add
                    </button>
                  </div>
                 </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    
    </div>
);
}

export default CRUD;



