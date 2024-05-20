import React, { useEffect, useState } from 'react'
import { BiSearch } from "react-icons/bi";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcSearch } from "react-icons/fc";


const SearchBar = () => {
    const navigate = useNavigate();
    const [key, setKey] = useState(null);
    // const [values, setValues] = useState([]);
    const [values, setValues] = useState('');
    const [click, setIsClick] = useState(false);
    // useEffect(()=>{    
    //     axios.get(`http://localhost:5000/searchproduct/${key}`)
    //     .then(res=>{console.log("done")
    //     console.log(key);
    // })
    //     .catch(err=>console.error(err))
    // })
    const searchItem = () => {
        setIsClick(true);
        axios.get(`http://localhost:5000/searchproduct/${key}`)
            .then(res => {
                // setValues(res)
                if (res.data === undefined || res.data == null || res.data == '') {
                    setValues(`${key}no such results....`);
                    return;
                }
                console.log(res.data);
                setValues(res.data.name);
                // if (Array.isArray(res.data)) {
                //     const names = (res.data).map(element => element.name);
                //     setValues(names);
                //   } else {
                //     console.error('res is not an array');
                //   }
            })
            .catch(err => console.error(err))
    }

    const handleInput = (e) => {
        e.preventDefault();
        setKey(e.target.value);
        setIsClick(false);
    }
    const handleChoice = () => {
        navigate('/market');
        setIsClick(false);
        // setValues('');
    }

    return (
        <div className="Search-container" >
            <div className="search-box">
                <input type="text" name="seachkey" id="searchkey" placeholder='Type Here To Search....' value={key} onChange={handleInput} />
              <BiSearch className='search-icon' onClick={searchItem}/>
               
            </div>
            {
                values && click &&
                <div className="results">
                    <ul>
                        <li onClick={handleChoice} onMouseOut={() => { setIsClick(false); setValues('') }}>{values}</li>
                        <li>{values}</li>

                    </ul>
                </div>
            }
        </div>
    )
}

export default SearchBar
