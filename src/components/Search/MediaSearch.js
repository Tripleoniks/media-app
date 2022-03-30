import axios from 'axios';
import { useState } from 'react';
import SearchInput from './SearchInput';
import Results from './Results';

const MediaSearch = () => {
  // const [data, setData] = useState([]);
  const [mediaResult, setMediaResult] = useState([]);
  const [initialDisplay, setInitialDisplay] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [errorStatus, setErrorStatus] = useState(false);
  const [searchHeading, setSearchHeading] = useState('Search history');

  const runSearch = () => {
    if (userInput !== '') {
      axios({
        url: `https://api.themoviedb.org/3/search/multi`,
        params: {
          api_key: process.env.REACT_APP_API_KEY,
          include_adult: false,
          original_language: 'en',
          query: userInput
        }
      }).then(res => {
        const data = res.data.results;
        // setData(data);
        // console.log(res);
        if (res.status === 200 && data.length > 0) {
          const filteredData = data.filter((content) => {
            if (content.poster_path !== null) {
              return content.media_type === "movie" || content.media_type === "tv";
            } 
          });
          setMediaResult(filteredData);
          setInitialDisplay(filteredData);
          console.log(mediaResult);
        } else {
          throw Error();
        }
      }).catch(() => {
        setErrorStatus(true);
      })
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    setErrorStatus(false);
    setInitialDisplay([]);
    setMediaResult([]);
    setFilteredResults([]);
    setSearchHeading(userInput);
    runSearch();
  }

  const handleChange = e => {
    setUserInput(e.target.value);
  }

  return (
    <>
      <form className="search" action="" onSubmit={handleSubmit}>
        <SearchInput
          change={handleChange}
          value={userInput}
        />
        <button>Search</button>
      </form>
      
      <Results
        result={mediaResult}
        display={initialDisplay}
        setDisplay={setInitialDisplay}
        filteredResults={filteredResults}
        setFilteredResults={setFilteredResults}
        heading={searchHeading}
        error={errorStatus}
      />
    </>
  )
}

export default MediaSearch;