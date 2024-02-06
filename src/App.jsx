import React, { useCallback, useEffect, useRef, useState } from "react";
import {Form,Button } from 'react-bootstrap';
import axios from 'axios';
import "./index.css";

const API_URL='https://api.unsplash.com/search/photos';
const IMAGES_PER_PAGE=20;

const Search=()=>{
    var searchInput=useRef('');
    const [images,setImages]=useState([]);
    const [totalPages,setTotalPages]=useState(0);
    const [page,setPage]=useState(1);
    const [err,setError]=useState('');
   // console.log('key',process.env.REACT_APP_API_KEY);

   const fetchImage= useCallback(async ()=>{
    try {
       if(searchInput.current.value){
        setError('');
        const {data}=await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}&client_id=${process.env.REACT_APP_API_KEY}`);
        setImages(data.results);
        setTotalPages(data.total_pages);
       }
   } catch (error) {
       setError("Error while loading images. Try again later.");
       console.log('error',error);
    }
   },[page])

   useEffect(()=>{
    fetchImage();
   }
   ,[fetchImage])

    const handleSearch=(e)=>{
        e.preventDefault();
        fetchImage();
        setPage(1);
        //console.log(searchInput.current.value);
    };

    const handleSelection=(selection)=>{
        searchInput.current.value=selection;
        fetchImage();
        setPage(1);
    };

    return (
        <>
        <div className="container">
        <h1 className="title">Image Search</h1>
        {err && <p className="error-msg">{err}</p>}
        <div className="search-section">
            <form onSubmit={handleSearch}>
               <Form.Control 
               type="text" 
               placeholder="Type Something to search..." 
                className="search-input"
                ref={searchInput}
               />
            </form>
        </div>
        <div className="filters">
            <button onClick={()=>{handleSelection('Birds')}}>Birds</button>
            <button onClick={()=>{handleSelection('Cats')}}>Cats</button>
            <button onClick={()=>{handleSelection('Dogs')}}>Dogs</button>
            <button onClick={()=>{{handleSelection('Nature')}}}>Nature</button>
        </div>
        <div className="images">
            {images.map((image)=>{
                return(
                    <img 
                    key={image.id}
                    src={image.urls.small}
                    alt={image.alt_description}
                    className="image"></img>
                )
            })}
        </div>
        <div className="buttons">
            {page>1 && <Button onClick={()=>{setPage(page-1)}}>Previous</Button>}
            {page<totalPages && <Button onClick={()=>setPage(page+1)}>Next</Button>}
        </div>
        </div>
        </>
    )
}

export default Search;