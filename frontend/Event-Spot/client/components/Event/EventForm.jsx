import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from "../Api_Resources/axios";
import { config } from "../Api_Resources/config";
import z from 'zod'

// https://www.dhiwise.com/post/zod-and-react-a-perfect-match-for-robust-validation
const EventForm = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    eventStartDateTime: "",
    eventEndDateTime: "",
    title: " ",
    description: " ",

    categoryId: null,
    ticketType: [
      { ticketName: " ", ticketPrice: " ", ticketCount: '', remainingTickets: '' },
    ],
    totalTickets: " ",
    venueName: "",
    ticketSaleStartTime: "",
    ticketSaleEndTime: "",


  })

  const [poster, setPoster] = useState([{
    title: '', file: null
  }])

  const [actors, setActors] = useState([{
    name: "",
    image: null
  }])



  const [allCategory, setAllCategory] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [locObj, setLocObj] = useState({
    address: '',
    place_id: '',
    lonlat: ['', ''],
    city: ''
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      const GEO_CODE_API_KEY = '659f7b557feb5653368044xyz79cdbd';

      const response = await axios.get(
        `https://geocode.maps.co/search?q=${searchTerm}&api_key=${GEO_CODE_API_KEY}`
      );

      setSearchResults(response.data);
      if (response.data.length === 0) {
        setSearchResults([
          { place_id: '404', display_name: 'Try typing different or check typo' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSelect = (selectedOption) => {
    setSelectedAddress(selectedOption);

    const selectedResult = searchResults.find(
      (result) => result.place_id === selectedOption.value
    );
    console.log(selectedResult, 'full data 42');

    setLocObj((prev) => ({
      ...prev,
      address: selectedResult.display_name,
      place_id: selectedResult.place_id,
      lonlat: [selectedResult.lon, selectedResult.lat],
      city: prev.city
    }));

  };


  const handleInputChange = (index, field, e) => {
    const updatedTicketTypes = [...form.ticketType];
    updatedTicketTypes[index][field] = e.target.value;

    setForm((prevForm) => ({
      ...prevForm,
      ticketType: updatedTicketTypes.map((ticket) => ({
        ...ticket,
        remainingTickets: ticket.ticketCount,
      })),
    }));
  };

  const handleRemoveSlot = (i) => {
    if (form.ticketType.length > 1) {
      const updatedForm = { ...form };
      updatedForm.ticketType.splice(i, 1);
      setForm(updatedForm);
    }
  };

  const handleRemoveActor = (i) => {
    const updatedActors = [...actors]
    updatedActors.splice(i, 1)
    setActors(updatedActors)
  }

  const handleFileChange = () => {
    console.log('handleFileChange');
  };

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`http://localhost:3311/api/categoryall`)
        const modifiedCategory = response.data.map((category) => ({
          label: category.name,
          value: category._id,
        }));
        setAllCategory(modifiedCategory);
      } catch (err) {
        console.log('Error fetching the Category', err);
      }
    };

    fetchCategory();
  }, []);

  const handleCategoryChange = (selectedCategory) => {
    setForm((prevForm) => ({
      ...prevForm,
      categoryId: selectedCategory.value,
    }));
  };




  const handleAddActors = () => {
    setActors([...actors, { name: "", image: null }])
  }
  const handleAddSlot = () => {
    setForm((prevForm) => ({
      ...prevForm,
      ticketType: [
        ...prevForm.ticketType,
        {
          ticketName: '',
          ticketPrice: '',
          ticketCount: '',
          remainingTickets: '',
        },
      ],
    }));
  };

  const handleTicketsSum = () => {
    // setForm(form((prevForm) => ({
    //   ...prevForm,
    //   totalTickets: prevForm.ticketType.reduce((acc, cv) => {
    //     acc += cv.ticketCount
    //     return acc
    //   }, 0)
    // })))
  };


  const handleRemovePoster = (index) => {
    const updatedPoster = [...poster]
    updatedPoster.splice(index, 1)
    setPoster(updatedPoster)
  };

  //Add the title and file
  const handleAddPoster = () => {
    setPoster([...poster, { title: "", file: null }])
  };

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }


  // useEffect(() => {
  //   const storedFormData = localStorage.getItem('eventFormData');
  //   if (storedFormData) {
  //     setForm(JSON.parse(storedFormData));
  //   }
  // }, []);

  // // Update localStorage whenever form data changes
  // useEffect(() => {
  //   localStorage.setItem('eventFormData', JSON.stringify(form));
  // }, [form])


  const handleNameValueChange = (name, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  const handlePosterChange = (index, field, e) => {
    const updatedPoster = [...poster]
    if (e.target.type === 'file') {
      updatedPoster[index][field] = e.target.files[0]
    } else {
      updatedPoster[index][field] = e.target.value
    }

    setPoster(updatedPoster)
  };

  const handleActorChange = (index, field, e) => {
    const updatedActors = [...actors];

    if (e.target.type === 'file') {
      // Handle file input
      updatedActors[index][field] = e.target.files[0]
    } else {
      // Handle non-file input
      updatedActors[index][field] = e.target.value;
    }
    setActors(updatedActors)
  };





  const renderFormSection = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <label>Title :</label>
            <input type="text" value={form.title} name="title" id="title" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />

            <label>Description :</label>
            <input type="text" value={form.description} name="description" id="description" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />


            <label>Event Start Time :</label>
            <input type="datetime-local" value={form.eventStartDateTime} name="eventStartDateTime" id="eventStartDateTime" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />

            <label>Event End Time :</label>
            <input type="datetime-local" value={form.eventEndDateTime} name="eventEndDateTime" id="eventEndDateTime" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />

            <label>venueName :</label>
            <input type="text" value={form.venueName} name="venueName" id="venueName" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />
            <label>Category:</label>
            <Select
              id="category"
              name="category"
              options={allCategory}
              value={allCategory.find((option) => option.value === form.categoryId)}
              onChange={handleCategoryChange}
              isSearchable
              placeholder="Select Categories"
            /><br /><br />


            <button onClick={() => nextStep()}>Next</button>
          </div>

        )
      case 2:
        return (
          <div>
            <label>Ticket Info</label>
            {form.ticketType.map((ticket, index) => (
              <div key={index}>
                <label>Name:</label>
                <input
                  type="text"
                  value={ticket.ticketName}
                  onChange={(e) => handleInputChange(index, 'ticketName', e)}
                />
                <label>Price:</label>
                <input
                  type="text"
                  value={ticket.ticketPrice}
                  onChange={(e) => handleInputChange(index, 'ticketPrice', e)}
                />
                <label>Total Seat:</label>
                <input
                  type="text"
                  value={ticket.ticketCount}
                  onChange={(e) => handleInputChange(index, 'ticketCount', e)}
                />
                {index >= 1 && (
                  <button type="button" onClick={() => handleRemoveSlot(index)}>
                    Delete
                  </button>
                )}

              </div>

            ))}
            {<button onClick={handleAddSlot}>+ Add</button>}<br /><br />


            <label>Total Tickets for this Event</label>
            <input type="Number" name="totalTickets" value={form.totalTickets} onChange={handleTicketsSum} /> <br /><br />

            <label>Ticket SaleStart Time :</label>
            <input type="datetime-local" value={form.ticketSaleStartTime} name="ticketSaleStartTime" id="ticketSaleStartTime" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />

            <label>Ticket SaleEnd Time :</label>
            <input type="datetime-local" value={form.ticketSaleEndTime} name="ticketSaleEndTime" id="ticketSaleEndTime" onChange={(e) => handleNameValueChange(e.target.name, e.target.value)} /><br /><br />
            <button onClick={() => prevStep()}>Prvious</button><button onClick={() => nextStep()}>Next</button>

          </div>
        )

      case 3:
        return (
          <div>
            <label>Poster Info</label>
            {poster.map((poster, index) => (
              <div key={index}>
                <label>Title:</label>
                <input
                  type="text"
                  value={poster.title}
                  onChange={(e) => handlePosterChange(index, 'title', e)}
                />

                <label>Upload:</label>
                <input
                  type="file"
                  accept='image/*'
                  onChange={(e) => handlePosterChange(index, 'file', e)}
                />

                {index >= 2 && (
                  <button type="button" onClick={() => handleRemovePoster(index)}>
                    Remove Poster
                  </button>
                )}
              </div>
            ))}

            {poster.length < 5 && (
              <button type="button" onClick={handleAddPoster}>
                + Slot
              </button>
            )}<br /><br />
            <div className='AddressContainer'>
              <input
                type="text"
                placeholder="Type to search addresses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={fetchAddresses}>Search</button>

              <Select
                options={searchResults.map((addr) => ({
                  label: addr.display_name,
                  value: addr.place_id
                }))}
                value={selectedAddress}
                onChange={handleAddressSelect}
                isSearchable
                placeholder="Select an address"
              />

              <label>City Name:</label>
              <input
                type="text"
                value={locObj.city}
                onChange={(e) => setLocObj((prev) => ({ ...prev, city: e.target.value }))}
              />

              <div className="actors">
                {actors.map((actor, index) => (
                  <div className="actor" key={index}>
                    <label>Enter the Actor name :</label>
                    <input type="text" value={actor.name} onChange={(e) => handleActorChange(index, "name", e)} /><br />
                    <label>Uplaod the Actor's Image </label>
                    <input type="file"
                      accept='image/*'
                      onChange={(e) => handleActorChange(index, "image", e)} />
                    {index >= 1 && <button onClick={() => handleRemoveActor(index)}> Delete</button>}<br /><br />
                  </div>
                ))}

                {actors.length < 4 && <button onClick={handleAddActors}>+Add</button>}

              </div><br /><br />
            </div>
            <button onClick={() => prevStep()}>Previous</button><button onClick={handleSubmit}>Submit</button>

          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = async () => {
    const eventFormData = new FormData();
  
    // Append individual fields
    eventFormData.append('eventStartDateTime', form.eventStartDateTime);
    eventFormData.append('eventEndDateTime', form.eventEndDateTime);
    eventFormData.append('title', form.title);
    eventFormData.append('description', form.description);
    eventFormData.append('venueName', form.venueName);
    eventFormData.append('ticketSaleStartTime', form.ticketSaleStartTime);
    eventFormData.append('ticketSaleEndTime', form.ticketSaleEndTime);
  
    if (form.categoryId) {
      eventFormData.append('category', form.categoryId);
    }
  
    // Append ticketType array
    form.ticketType.forEach((ticket, index) => {
      eventFormData.append(`ticketType[${index}][ticketName]`, ticket.ticketName);
      eventFormData.append(`ticketType[${index}][ticketPrice]`, ticket.ticketPrice);
      eventFormData.append(`ticketType[${index}][ticketCount]`, ticket.ticketCount);
      eventFormData.append(`ticketType[${index}][remainingTickets]`, ticket.remainingTickets);
    });
  
    // Append poster array
    form.poster.forEach((poster, index) => {
      eventFormData.append(`poster[${index}][title]`, poster.title);
      eventFormData.append(`poster[${index}][file]`, poster.file);
    });
  
    // Append actors array
    form.actors.forEach((actor, index) => {
      eventFormData.append(`actors[${index}][name]`, actor.name);
      eventFormData.append(`actors[${index}][image]`, actor.image);
    });
  
    // Append addressInfo
    eventFormData.append('addressInfo{{address}', locObj.address);
    eventFormData.append('addressInfo{city}', locObj.city);
  
    // Append location coordinates
    eventFormData.append(`location{coordinates}[]`, locObj.lonlat[0]);
    eventFormData.append('location{coordinates}[]', locObj.lonlat[1]);

    const formDataObject = {
      eventStartDateTime: eventFormData.get('eventStartDateTime'),
      eventEndDateTime: eventFormData.get('eventEndDateTime'),
      title: eventFormData.get('title'),
      description: eventFormData.get('description'),
      poster: eventFormData.getAll('poster').map((poster, index) => ({
        title: eventFormData.get(`poster[${index}][title]`),
        file: poster.name, // Assuming you want the file name here
      })),
      categoryId: eventFormData.getAll('categoryId'),
      ticketType: eventFormData.getAll('ticketType').map((ticket, index) => ({
        ticketName: eventFormData.get(`ticketType[${index}][ticketName]`),
        ticketPrice: parseFloat(eventFormData.get(`ticketType[${index}][ticketPrice]`)),
        ticketCount: parseInt(eventFormData.get(`ticketType[${index}][ticketCount]`)),
        remainingTickets: parseInt(eventFormData.get(`ticketType[${index}][remainingTickets]`)),
      })),
      totalTickets: parseInt(eventFormData.get('totalTickets')),
      venueName: eventFormData.get('venueName'),
      addressInfo: {
        address: eventFormData.get('addressInfo[address]'),
        city: eventFormData.get('addressInfo[city]'),
      },
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(eventFormData.get('location[coordinates][]')),
          parseFloat(eventFormData.get('location[coordinates][]')),
        ],
      },
      organiserId: eventFormData.get('organiserId'),
      isApproved: eventFormData.get('isApproved') === 'true',
      reviews: eventFormData.getAll('reviews').map((review, index) => ({
        userId: eventFormData.get(`reviews[${index}][userId]`),
        title: eventFormData.get(`reviews[${index}][title]`),
        body: eventFormData.get(`reviews[${index}][body]`),
        rating: eventFormData.get(`reviews[${index}][rating]`),
      })),
      actors: eventFormData.getAll('actors').map((actor, index) => ({
        name: eventFormData.get(`actors[${index}][name]`),
        image: actor.name, // Assuming you want the file name here
      })),
      ticketSaleStartTime: eventFormData.get('ticketSaleStartTime'),
      ticketSaleEndTime: eventFormData.get('ticketSaleEndTime'),
    };
  
    console.log(formDataObject);
  
    try {
      const response = await axios.post('/api/event', formDataObject, config)
      console.log(response.data, "I am data");
    } catch (err) {
      console.log(err)
    }
  
  };
  

  return (
    <div>
        {renderFormSection()}
    </div>
  );
}

export default EventForm
