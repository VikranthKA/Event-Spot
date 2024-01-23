import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserProfile() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('')
  const [locObj, setLocObj] = useState({
    address: '',
    place_id: '',
    lonlat: ['', ''],
    city: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [profilePic, setProfilePic] = useState(null);
  const [description, setDescription] = useState('');
  const [displayPic, setDisplayPic] = useState('');
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const savedDetails = JSON.parse(localStorage.getItem('profileDetails')) || {};
    setLocObj(savedDetails);

    if (id) {
      axios.get(`/api/user/${id}`)
        .then(response => {
          setUserDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    }

    const savedDescription = localStorage.getItem('description') || '';
    setDescription(savedDescription);

    const savedDisplayPic = localStorage.getItem('displayPic') || '';
    setDisplayPic(savedDisplayPic);
  }, [id]);

  const fetchAddresses = async () => {
    try {
      const GEO_CODE_API_KEY = '659f7b557feb5653368044xyz79cdbd';
      const response = await axios.get(
        `https://geocode.maps.co/search?q=${searchTerm}&api_key=${GEO_CODE_API_KEY}`
      );

      setSearchResults(response.data);
      if (response.data.length === 0) {
        setSearchResults([
          {
            place_id: '404',
            display_name: 'Try typing different or check typo',
          },
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

    setLocObj({
      address: selectedResult.display_name,
      place_id: selectedResult.place_id,
      lonlat: [selectedResult.lon, selectedResult.lat],
      city: locObj.city,
    });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const confirmAddress = () => {
    if (!selectedAddress) {
      console.log('Please select an address before confirming.');
      return;
    }

    const formData = new FormData();
    formData.append('profilePic', profilePic);
    formData.append('description', description);
    formData.append('address', locObj.address);
    formData.append('place_id', locObj.place_id);
    formData.append('lonlat', locObj.lonlat.join(','));
    formData.append('city', locObj.city);

    axios
      .post('/api/profile', formData)
      .then((response) => {
        console.log('Backend response:', response.data);

        const updatedLocObj = {
          ...locObj,
          address: response.data.address,
          place_id: response.data.place_id,
          lonlat: response.data.lonlat.split(','),
          city: response.data.city,
        };

        localStorage.setItem('profileDetails', JSON.stringify(updatedLocObj));
        setLocObj(updatedLocObj);

        localStorage.setItem('description', response.data.description);
        setDescription(response.data.description);

        localStorage.setItem('displayPic', response.data.profilePic);
        setDisplayPic(response.data.profilePic);
      })
      .catch((error) => {
        console.error('Error sending data to the backend:', error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-3">
        <img
          className="rounded-circle"
          src={`http://localhost:3999/uploads/${displayPic}`}
          alt="Profile"
          width="100"
          height="100"
        />
        <h2>Profile Image</h2>
      </div>

      <form encType="multipart/form-data">
        <input
          type="file"
          name="profilePic"
          onChange={handleFileChange}
          accept="image/*"
        />
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <br />
        <h2>Address: </h2>
        <div className="AddressContainer">
          <input
            type="text"
            placeholder="Type to search addresses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" onClick={fetchAddresses}>
            Search
          </button>

          <Select
            options={searchResults.map((addr) => ({
              label: addr.display_name,
              value: addr.place_id,
            }))}
            value={selectedAddress}
            onChange={handleAddressSelect}
            isSearchable
            placeholder="Select an address"
          />

          <input
            type="text"
            value={locObj.city}
            onChange={(e) =>
              setLocObj((prev) => ({ ...prev, city: e.target.value }))
            }
          />
          <br />
          <button type="button" onClick={confirmAddress}>
            Confirm Address
          </button>
        </div>
      </form>

      <div className="mt-4">
        <h2>Entered Details:</h2>
        <p>
          <strong>Description:</strong> {description}
        </p>
        <p>
          <strong>Address:</strong> {locObj.address}
        </p>
        <p>
          <strong>City:</strong> {locObj.city}
        </p>
      </div>
      <div className="mt-4">
        <h2>User Details:</h2>
        <p>
          <strong>Email:</strong> {userDetails.email}
        </p>
        <p>
          <strong>Username:</strong> {userDetails.username}
        </p>
      </div>
    </div>
  );
}
