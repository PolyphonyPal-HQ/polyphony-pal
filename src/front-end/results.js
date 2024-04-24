import React, { useState, useEffect } from 'react';
import SheetMusicComponent from './SheetMusicComponent';
import { Paper, CircularProgress, Grid, Typography } from '@mui/material';
import Upload from "./components/upload";
import Header from './components/polypalHeader';
import css from "./components/frontEnd.module.css"



//DONT DELETE
//delay fetch to test loading bars
// const delayedfetch = (url, options, delay = 10000) => new Promise((resolve, reject) => {
//     setTimeout(() => {
//         fetch(url, options)
//             .then(resolve)
//             .catch(reject);
//     }, delay);
// });


//fetch musicXML data to give to SheetMusicComponent
function Results() {
    const [musicXml, setMusicXml] = useState('');
    const [isLoading, setIsLoading] = useState(true); //loading spinner state
    const [pageError, setError] = useState(null); //error message state
    const [uploadVis, setUploadVis] = useState(true);
    const [musicErrors, setMusicErrors] = useState([]);//contains array of music errors
    const [musicSuggestions, setMusicSuggestions] = useState([]);//contains array of music errors
    

    const renderContent = () => {
        if(uploadVis){
            const title= String.raw`Upload Music XML File`; 
            const subtitle = String.raw`Export Music XML file from Musescore or any other editor`;
            return <Upload titleTXT={title} subTXT={subtitle} setVis={setUploadVis} setXML={setMusicXml}
                     setLoading={setIsLoading} setMusicErrors={setMusicErrors} setMusicSuggestions={setMusicSuggestions} />;
        }
        else{   
            if (pageError) {
                return <p>Error: {error}</p>;
            } else if (isLoading) {
                return(<CircularProgress />);
            } else if (musicXml) { //musicXML done loading
                return(
                <div> 
                <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center', padding: "10px"}} className={css.flex_container}>  
                    <Grid container item  direction="column" sx={{ overflow: 'visible', width: '40vw'}} >
                            <Paper  sx={{  pt:5, backgroundColor: "#ffffff", borderRadius: 5,  width: "100%"}} elevation={4} >
                                <Grid sx={{justifyContent: 'center'}}>
                                    <SheetMusicComponent musicXml={musicXml} />
                                </Grid>
                            </Paper>
                    </Grid>
                    

<<<<<<< HEAD

                    <Grid container item   className={css.error_scroller} >
                        {musicErrors.map((error) => ( 
                            <Grid item pb={2} pr={2} key={musicErrors.indexOf(error)}>
                                <Paper className={css.error_scroller_paper} elevation={2} >
                                    Title: {error.title} <br/><br/> 
                                    Measure Number: {error.location[0]} <br/>
                                    Offset:{error.location[1]} <br/><br/> 
                                    Description: {error.description} <br/><br/> 
                                    Suggestion: {error.suggestion} 
                                </Paper>
                            </Grid>
                        ))}
=======
                    <Grid container item  sx={{maxHeight: '80vh', maxWidth: '15vw'}}>
                        <Typography>Errors</Typography>
                        <Grid container item className={css.error_scroller}>
                            {musicErrors.map((error) => ( 
                                <Grid item pb={2} pr={2} key={musicErrors.indexOf(error)}>
                                    <Paper sx={{ padding: 3,  backgroundColor: "#ffffff", borderRadius: 5}} elevation={2} >
                                        Title: {error.title} <br/><br/> 
                                        Measure Number: {error.location[0]} <br/>
                                        Offset:{error.location[1]} <br/><br/> 
                                        Description: {error.description} <br/><br/> 
                                        Suggestion: {error.suggestion} 
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
>>>>>>> 00b65b29b0f64b3801825a1c4d6d90e9ab79ec9a
                    </Grid>

                    <Grid container item  sx={{maxHeight: '80vh', maxWidth: '15vw'}}>
                        <Typography>Suggestions</Typography> 
                        <Grid container item   className={css.error_scroller} >
                            {musicSuggestions.map((error) => ( 
                                <Grid item pb={2} pr={2} key={musicSuggestions.indexOf(error)}>
                                    <Paper sx={{ padding: 3,  backgroundColor: "#ffffff", borderRadius: 5}} elevation={2} >
                                        Title: {error.title} <br/><br/> 
                                        Measure Number: {error.location[0]} <br/>
                                        Offset:{error.location[1]} <br/><br/> 
                                        Description: {error.description} <br/><br/> 
                                        Suggestion: {error.suggestion} 
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

<<<<<<< HEAD
                    <Paper className={css.error_counter_paper} elevation={2} >
                        <Typography>Number of Errors: {musicErrors.length}</Typography>
                    </Paper>

=======
                    <Grid container item  sx={{maxHeight: '80vh', maxWidth: '15vw'}}>
                        <Typography>Suggestions</Typography> 
                            <Paper sx={{ padding: 3,  backgroundColor: "#ffffff", borderRadius: 5, width: "10vw", ml:2}} elevation={2} >
                                <Typography>Number of Errors: {musicErrors.length}</Typography>
                            </Paper>
                    </Grid>
>>>>>>> 00b65b29b0f64b3801825a1c4d6d90e9ab79ec9a
                </Grid>  
                </div>  
                );
            } else {
                /// TODO: case of no loading but also no error and no musicXML
                return <p>No sheet music data available.</p>;
            }
        }    
        
    };


    return (
        <div  className={css.flex_container}>
         
          
        <Grid >
         
             <Header />
            
            {renderContent()}
        </Grid>
        
        
        </div>
       
    );
}
export default Results;
