import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Context from '../../ContextApi/Context';

function Header() {
  const { isLogin, handleLogout } = useContext(Context)
  const [searchQuery,setSearchQuery] = useState("")
  const navigate = useNavigate(); 

  const handleChangeLogout = () => {
    handleLogout();
    alert('Logout Successfully');
  }

  const handleSearch = ()=>{
    console.log(searchQuery)
  }


return(
    <>
      <header>
      <nav>
        <div >
          <ul >
            {isLogin && (
              <>
                <li >
                  <Link className='Link' to='/'>
                    Home
                  </Link>
                </li>
                <li >
                  <Link className='Link' to='/'>
                    All-Event
                  </Link>
                </li>
                <li >
                  <Link className='Link' to='/event-form'>
                    Create-New Event
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <div >
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </nav>
      <div >
        <div >
          {isLogin ? (
            <>
              {/* trigger the onClick to the Dark by redux */}
              <button>Dark</button>
              <button onClick={() => navigate('/user-profile')}>Profile</button>
              <button onClick={handleChangeLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/register')}>Register</button>
              <button onClick={() => navigate('/login')}>Login</button>
            </>
          )}
        </div>
      </div>
    </header>

    </>
)
}


export default Header;
