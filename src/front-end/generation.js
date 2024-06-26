import React, { useState, useEffect } from 'react';
import SheetMusicComponent from './SheetMusicComponent';
import { TextField, Paper, Grid, CircularProgress, Typography, Button, Select, MenuItem, FormControl, InputLabel, OutlinedInput, Alert, Collapse } from '@mui/material';
import Header from './components/polypalHeader';
import css from "./components/frontEnd.module.css"
import XMLtoMIDI from './XMLtoMIDI';  // Adjust the path as necessary
import { HOST } from './utils';

function Generation() {
    const [ddValue, setDD] = useState("");
    const [textVal, setTextVal] = useState("");
    const [spinner, setSpinner] = useState(false);
    const [generating, setGen] = useState(false);
    const [noneFound, setNoneFound] = useState(false);
    const [musicXML, setMusicXML] = useState('');
    const [alertCopy, setAlertCopy] = useState(false);
    const [selectedXmlId, setSelectedXmlId] = useState(null);
    const [inputError, setInputError] = useState(false); // State to manage input error

    const handleClick = (id) => {
        setSelectedXmlId(prevId => prevId === id ? null : id);
    };

    const handleTextChange = (event) => {
        const inputText = event.target.value;
        setTextVal(inputText);
    };

    const validateRomanNumeral = (input) => {
        // Implement your own Roman numeral validation logic here
        if (!ddValue) {
            return true
        }
        // Example validation (simplified): Check if input contains only valid Roman numeral characters
        let romanNumeralRegex;
        if (ddValue.charAt(0) === ddValue.charAt(0).toUpperCase()) {
            romanNumeralRegex = /^(?:(?:viio|IV|I|ii|iii|V|vi)(?:6|64|42|43|65|7|9|11|13|2)?(?:\/(?:viio|IV|I|ii|iii|V|vi)(?:6|64|42|43|65|7|9|11|13|2)?)?(?:,(?!$)|$))+$/;
        } else {
            romanNumeralRegex = /^(?:(?:VII|VI|V|v|iv|III|iio|i)(?:6|64|42|43|65|7|9|11|13|2)?(?:\/(?:VII|VI|V|v|iv|III|iio|i)(?:6|64|42|43|65|7|9|11|13|2)?)?(?:,(?!$)|$))+$/;
        }
        return romanNumeralRegex.test(input);
    };

    const handleDDchange = (e) => {
        setDD(e.target.value)
    };

    // Effect to validate input when ddValue or textVal changes
    useEffect(() => {
        // Validate Roman numeral input
        const isRomanNumeralValid = validateRomanNumeral(textVal);

        // Update inputError state based on validation result
        setInputError(!isRomanNumeralValid);

    }, [ddValue, textVal]); // Trigger effect when ddValue or textVal changes


    function copyContent(xml) {

        try {
            navigator.clipboard.writeText(xml);
            console.log('Content copied to clipboard');
            /* Resolved - text copied to clipboard successfully */

            console.log(alertCopy)
            setAlertCopy(true)
            setTimeout(() => {
                setAlertCopy(false);
            }, 3000);


        } catch (err) {
            console.error('Failed to copy: ', err);
            /* Rejected - text failed to copy to the clipboard */
        }
    }

    //upload to api music_generation function
    const upload = async () => {
        const values = [ddValue, textVal]
        try {
            setSpinner(true)
            let res = await fetch(`${HOST}/musicGeneration`,
                {
                    method: "POST",
                    body: JSON.stringify({ values }),
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
            let data = await res.json()
            let id = data.id
            console.log(data)

            res = await fetch(`${HOST}/RomanScore/${id}/XML`, {
                method: 'GET'
            });
            data = await res.json();
            const xmls = data.xmls;
            if (xmls.length > 0 || data.finished) {
                setSpinner(false)
                setGen(true)
            }
            setMusicXML(xmls);

            const interval = setInterval(async () => {
                const res = await fetch(`${HOST}/RomanScore/${id}/XML`, {
                    method: 'GET'
                });
                const data = await res.json();
                const xmls = data.xmls;
                if (xmls.length > 0 || data.finished) {
                    setSpinner(false)
                    setGen(true)
                }
                setMusicXML(xmls);

                if (data.finished) {
                    clearInterval(interval); // Stop polling if finished
                    setGen(false)
                    if (xmls.length == 0) {
                        setNoneFound(true)
                    }
                }
            }, 10000); // Poll every 10 seconds (10000 milliseconds)

            // setMusicXML(data);
            // setSpinner(false);
        }
        catch (error) {
            console.error("Error during the upload process:", error)
        }
    }
    //once music is set, render
    //drop down to be removed!

    const circleOfFifths = "C,G,D,A,E,B,C-,F#,G-,C#,D-,A-,E-,B-,F,a,e,b,f#,c#,g#,e-,d#,b-,f,c,g,d".split(','); const title = "Generate Music"
    const subtitle = "Input chords/roman numerals and key signature"
    const thirdtitle = "Please enter a comma separated list ex) I,ii,V7,I"
    const text = { upload_title: title, upload_subtitle: subtitle, upload_thirdtitle: thirdtitle }

    const render_content = () => {
        if (spinner) { //if waiting on data, show spinner
            return (<div><Typography className={css.upload_title}>Generated Scores</Typography>
                <Typography className={css.upload_numerals}>Roman Numerals: {textVal}<br></br> Key Signature: {ddValue}</Typography>
                <CircularProgress /> <p>You have found a new roman numeral sequence! Generating music... This may take a few minutes </p></div>);
        }
        else {

            if (musicXML) {//if data is recieved, render it and say we're waiting for more
                return (
                    <Grid container direction="column">
                        <Collapse className={css.alert_copy} in={alertCopy}><Alert variant="filled" severity='info' >Music XML has been copied to clipboard</Alert></Collapse>
                        <Typography className={css.upload_title}>Generated Scores</Typography>
                        <Typography className={css.upload_numerals}>Roman Numerals: {textVal} <br></br> Key Signature: {ddValue}</Typography>
                        {noneFound && <Typography className={css.upload_numerals}>No valid harmonizations were found for this key and roman numeral combination.</Typography>}
                        {generating ? (<div><CircularProgress /> <p className={css.upload_numerals}>Generating music... This may take a few minutes: </p></div>) : null}


                        <Grid container direction="row" className={css.flex_container} spacing={2}>
                            {musicXML.map(xml =>
                                <Grid item pb={2} sx={{ width: "60vh" }}>
                                    <Paper className={css.music_paper} onClick={() => { copyContent(xml.xml); handleClick(xml.id) }} >
                                        <SheetMusicComponent musicXml={xml.xml} key={xml.id} />
                                    </Paper>
                                    {selectedXmlId === xml.id && <XMLtoMIDI musicXML={xml.xml} />} {/* Render XMLtoMIDI component conditionally */}
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                );
            }
            else {//wait for user input

                return (
                    <div>
                        <Grid container mt={{ xs: 20, sm: 20, md: 20, lg: 20, xl: 20 }} className={css.flex_container}>
                            <Grid item align="center">
                                <Paper className={css.upload_paper} elevation={3}>
                                    {Object.keys(text).map((key) => (
                                        <Typography key={key} className={css[key]}>
                                            {text[key]}
                                        </Typography>
                                    ))}

                                    <Grid item>
                                        <TextField
                                            id="outlined-basic"
                                            label="Roman Numerals"
                                            variant="outlined"
                                            sx={{ width: 200 }}
                                            value={textVal}
                                            onChange={handleTextChange}
                                            error={inputError} // Set error state on TextField
                                            helperText={inputError ? 'Invalid Roman numerals' : ''}
                                        />

                                        <FormControl variant="outlined" sx={{ width: 180, px: 2 }}>
                                            <InputLabel id="Key" sx={{ px: 2.6 }}>
                                                Key Signature
                                            </InputLabel>
                                            <Select
                                                value={ddValue}
                                                onChange={handleDDchange}
                                                input={<OutlinedInput label="Key Signature" />}
                                            >
                                                {circleOfFifths.map((key) => (
                                                    <MenuItem key={key} value={key}>
                                                        {key}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Button className={css.btnLG} onClick={upload} disabled={inputError || !ddValue || !textVal}>
                                            Upload
                                        </Button>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                );
            }
        }

    }
    return (
        <div >

            <Header />
            {render_content()}

        </div>
    );
}
export default Generation;


