import React, { Component, Fragment } from "react";
import axios from "axios";
import { Card, CardDeck, Form ,CardColumns} from 'react-bootstrap';
import car from '../highway.jpg';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import { Divider } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import HomeIcon from '@material-ui/icons/Home';
import { Chart, Dataset } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

class Dashboard extends Component {
    state = {
        selectedFile: "",
        image_class: "",
        uploadedFiles: [],
        currentImage: "",
        prob: "",
        predictionValues: [],
        noDataToggle: false,
        showResults: false,
        outputFiles :[]
    };

    handleClick = (e) => {
        console.log('e', e.target.id);
       // if (e.target.id === 'Results') {
            this.setState({ showResults: true });
            console.log('uploaded FIles',this.state.uploadedFiles);
       // }
    } 
    
    showHome = (e) => {
        console.log('e', e.target.id);
       // if (e.target.id === 'Results') {
            this.setState({ showResults: false });
            //console.log('uploaded FIles',this.state.uploadedFiles);
       // }
    }

    onPicSubmit = (e) => {
        e.preventDefault();


        console.log(this.state.selectedFile);


        console.log(this.state.uploadedFiles);

        for (let i = 0; i < this.state.uploadedFiles.length; i++) {

            //(function (eachFile) {
            setTimeout(() => {
                const data = new FormData();
                data.append("image", this.state.uploadedFiles[i]);
                let payload = {
                    data
                };

                try {
                    axios

                        // .//post(`http://54.177.173.161/trafficsignrecapi/predict`, data)

                        .post(`http://127.0.0.1:5000/trafficsignrecapi/predict`, data)
                        .then((res) => {
                            console.log(res);
                            console.log(res.data.image_class);
                            this.setState({
                                image_class: res.data.image_class,
                                prob: (res.data.prob * 100).toFixed(2),
                                noDataToggle: true
                            });
                            this.state.predictionValues.push((res.data.prob * 100).toFixed(2));
                            let outputData = {
                                imgSrc: URL.createObjectURL(this.state.uploadedFiles[i]),
                                image_class: res.data.image_class,
                                prob: (res.data.prob * 100).toFixed(2),
                            }
                            this.setState({
                                 currentImage: URL.createObjectURL(this.state.uploadedFiles[i]),
                                 outputFiles : this.state.outputFiles.concat(outputData)
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    //this.setState({currentImage : URL.createObjectURL(eachFile)})

                } catch (error) {
                }
            }, i * 3000);
            //})(eachFile);
        }
    };
    render() {
        return (
            <Fragment>
                {!this.state.showResults &&
                    <div>
                        <div style={{ "margin-top": "5%" }} className="container" align="center">
                            <Typography variant="h3" gutterBottom>
                            <strong>
                                Traffic Sign Recognition
                                </strong>
                    </Typography>
                        </div>
                        <form onSubmit={this.onPicSubmit} enctype="multipart/form-data">
                            <CardDeck style={{ "margin-top": "5%", "margin-left": "15%", "margin-right": "auto" }}>

                                <Card
                                    bg='dark'
                                    text='white'
                                    style={{ 'max-width': '18rem' }}
                                >
                                    <Card.Header>Upload Images</Card.Header>
                                    <Card.Body>
                                        <Form.File
                                            id="file"
                                            label="Upload Images"
                                            custom
                                            style={{ fontSize: "13px" }}
                                            type="file"
                                            name="file"
                                            multiple
                                            onChange={(event) => {

                                                console.log(event.target.files[0]);
                                                console.log('files', event.target.files.length);
                                                this.setState({
                                                    selectedFile: event.target.files[0],
                                                    uploadedFiles: event.target.files
                                                });
                                            }}
                                        />
                                        <Divider />
                                        <Divider />

                                        <input className='btn btn-success' type='submit' value='Submit'></input>
                                    </Card.Body>
                                </Card>
                                <Card
                                    bg='dark'
                                    text='white'
                                    style={{ 'max-width': '28rem' }}
                                >
                                    <Card.Header>Image Input</Card.Header>
                                    <Card.Body>
                                        {this.state.noDataToggle &&
                                            <Fragment>
                                                <img src={this.state.currentImage} style={{ 'max-width': '20rem','max-height': '20rem' }}/>
                                                <Divider />
                                                <Typography variant="h6">  Predicted Sign : {this.state.image_class} </Typography>
                                                <Divider />
                                                <Typography variant="h6">
                                                    Prediction Accuracy : {this.state.prob} %
                                        </Typography>
                                            </Fragment>
                                        }
                                        {!this.state.noDataToggle &&
                                            <div>
                                                Upload images to begin processing
                                       </div>
                                        }
                                    </Card.Body>
                                </Card>

                                <Card
                                    bg='dark'
                                    text='white'
                                    style={{ 'max-width': '30rem' }}
                                >
                                    <Card.Header>Prediction Accuracy</Card.Header>
                                    <Card.Body>
                                        {this.state.noDataToggle &&
                                            <div className="rainbow-p-vertical_medium rainbow-m_auto" >
                                                <div className="rainbow-align-content_center">
                                                    <Chart
                                                        labels={this.state.predictionValues}
                                                        type="line"
                                                        className="rainbow-m-horizontal_xx-large rainbow-m-top_x-large"
                                                    >
                                                        <Dataset
                                                            title="Dataset 1"
                                                            values={this.state.predictionValues}
                                                            backgroundColor="#1de9b6"
                                                            borderColor="#1de9b6"
                                                        />
                                                    </Chart>
                                                </div>
                                            </div>
                                        }
                                        {!this.state.noDataToggle &&
                                            <div>
                                                Upload images to show prediction accuracy
                                    </div>
                                        }
                                    </Card.Body>
                                </Card>


                            </CardDeck>
                        </form>
                        {this.state.uploadedFiles.currentImage &&
                            <Card
                                bg='dark'
                                text='white'
                                style={{ 'max-width': '25rem', 'max-height': '25rem' }}
                            >
                                <Card.Header>Image Input</Card.Header>
                                <Card.Body>

                                </Card.Body>
                            </Card>
                        }

                    </div>
                }


                {this.state.showResults &&
                    <CardColumns style={{ "margin-top": "5%", "margin-left": "15%", "margin-right": "auto" }}>
                    {Object.entries(this.state.outputFiles).map(([key,value], index) => {
                        console.log('value',value);
                        return (
                            <Card
                                bg='dark'
                                text='white'
                                style={{ 'max-width': '18rem' }}
                            >
                            <Card.Img variant="top" src={value.imgSrc} />
                                <Card.Body>
                                <Divider/>
                                Predicted Class: <strong>{value.image_class} </strong>
                                    <Divider/>
                                      Prediction Accuracy:  <strong>{value.prob}</strong>
                                </Card.Body>
                            </Card>
                        )
                    })}
                    </CardColumns>

                }
                <div>
                    <Drawer

                        variant="permanent"

                        anchor="left"
                    >
                        <div />
                        <Divider />
                        <List>
                            <ListItem button id='Results' onClick={this.handleClick} key={'Results'}>
                                <ListItemIcon><InboxIcon /> </ListItemIcon>
                                <ListItemText primary={'Results'} />
                            </ListItem>
                            <ListItem button id='Home' onClick={this.showHome} key={'Home'}>
                                <ListItemIcon><HomeIcon /> </ListItemIcon>
                                <ListItemText primary={'Home'} />
                            </ListItem>
                        </List>
                        <Divider />
                    </Drawer>
                </div>
            </Fragment>
        );
    }
}
export default Dashboard;
