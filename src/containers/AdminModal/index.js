/**
*
* AdminModal
*
*/

import React from 'react';
import firebase from 'firebase';
import { createValue } from 'react-forms';
import { Fieldset, Field } from 'react-forms';
import Dropzone from 'react-dropzone';
const Line = require('rc-progress').Line;
import Icon from 'react-evil-icons';
import { firebaseStorage } from '../../utils/firebase';

import Button from '../../components/Button';

import styles from './styles.css';

class AdminModal extends React.Component {
	constructor(props) {
    	super(props)
	    let formValue = createValue({
	      	value: props.value,
	      	onChange: this.onChangeForm.bind(this)
	    });
    	this.state = {
    		formValue,
    		titleError: false,
    		descriptionError: false,
    		imageUpload: {
    			progress: 0,
    			running: false,
    			url: false,
    			error: false,
    		},
    		docUpload: {
    			progress: 0,
    			running: false,
    			url: false,
    			error: false,
    		},
    	}
  	}

  	onChangeForm(formValue) {
    	this.setState({formValue})
  	}

  	handleImgUpload = (file) => {
  		const uploadTask = firebaseStorage.child(`document-covers/${file[0].name}`).put(file[0]);
	    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
	        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	        console.log('Upload is ' + progress + '% done');
	        switch (snapshot.state) {
	          	case firebase.storage.TaskState.PAUSED: // or 'paused'
	            	console.log('Upload is paused');
	            	this.setState({
	            		imageUpload: {
			        		progress: progress,
			        		running: false,
			        		url: false,
			        		error: 'pause',
			        	},
			        });
	            	break;
	          	case firebase.storage.TaskState.RUNNING: // or 'running'
	            	console.log('Upload is running');
	            	this.setState({
	            		imageUpload: {
			        		progress: progress,
			        		running: true,
			        		url: false,
			        		error: false,
			        	},
			        });
	            	break;
	           	default:
	           		break;
	        }
	      }, (error) => {
	      switch (error.code) {
	        case 'storage/unauthorized':
	          	// User doesn't have permission to access the object
	          	this.setState({
            		imageUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'auth',
		        	},
		        });
	          	break;
	        case 'storage/canceled':
		        // User canceled the upload
		        this.setState({
            		imageUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'cancel',
		        	},
		        });
	        	break;
	        case 'storage/unknown':
	        	// Unknown error occurred, inspect error.serverResponse
	        	this.setState({
            		imageUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'unkown',
		        	},
		        });
	          	break;
	        default:
	        	break;
	      }
	    }, () => {
	      // Upload completed successfully, now we can get the download URL
	      const downloadURL = uploadTask.snapshot.downloadURL;
	      this.setState({
        		imageUpload: {
	        		progress: 100,
	        		running: false,
	        		url: downloadURL,
	        		error: false,
	        	},
	        });
	    });
  		
  	}

  	handleDocUpload = (file) => {
  		const uploadTask = firebaseStorage.child(`documents/${file[0].name}`).put(file[0]);
	    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
	        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	        console.log('Upload is ' + progress + '% done');
	        switch (snapshot.state) {
	          	case firebase.storage.TaskState.PAUSED: // or 'paused'
	            	console.log('Upload is paused');
	            	this.setState({
	            		docUpload: {
			        		progress: progress,
			        		running: false,
			        		url: false,
			        		error: 'pause',
			        	},
			        });
	            	break;
	          	case firebase.storage.TaskState.RUNNING: // or 'running'
	            	console.log('Upload is running');
	            	this.setState({
	            		docUpload: {
			        		progress: progress,
			        		running: true,
			        		url: false,
			        		error: false,
			        	},
			        });
	            	break;
	           	default:
	           		break;
	        }
	      }, (error) => {
	      switch (error.code) {
	        case 'storage/unauthorized':
	          	// User doesn't have permission to access the object
	          	this.setState({
            		docUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'auth',
		        	},
		        });
	          	break;
	        case 'storage/canceled':
		        // User canceled the upload
		        this.setState({
            		docUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'cancel',
		        	},
		        });
	        	break;
	        case 'storage/unknown':
	        	// Unknown error occurred, inspect error.serverResponse
	        	this.setState({
            		docUpload: {
		        		progress: 0,
		        		running: false,
		        		url: false,
		        		error: 'unkown',
		        	},
		        });
	          	break;
	        default:
	        	break;
	      }
	    }, () => {
	      // Upload completed successfully, now we can get the download URL
	      const downloadURL = uploadTask.snapshot.downloadURL;
	      this.setState({
        		docUpload: {
	        		progress: 100,
	        		running: false,
	        		url: downloadURL,
	        		error: false,
	        	},
	        });
	    });
  		
  	}

  	onSubmit = () => {
  		const { formValue } = this.state;
  		const { title, description } = formValue.value;
  		// console.log('title, description, img, file, category:', title, description, img, file, category);
  	}

	render() {
		const { formValue, titleError, imageUpload, docUpload } = this.state;
  		const { categoryList } = this.props;

		return (
		    <div className={styles.wrapper}>
			    <div className={styles.container}>
			        <h1>Adicionar novo</h1>
			        	<form onSubmit={this.onSubmit}>
			        		{titleError && <span className={styles.error}>Insira o título</span>}
				        	<Fieldset formValue={formValue}>
						        <Field select="title" label="Título" />
						        <Field select="description" label="Descrição" />
						    </Fieldset>
						    <span>Categoria - <span className={styles.link}>criar nova</span></span>
						    <select>
						    	{categoryList.map((item, key) => <option key={key} value={item.name}>{item.name}</option>)}
						    </select>
						    <div className={styles.uploadContainer}>
						    	<div>
								    <span>Imagem de capa</span>
							    	{!imageUpload.url &&
							    		<Dropzone onDrop={this.handleImgUpload}>
						            		<Icon name="ei-eye" size="l" />
						            		<span>+</span>
						            		<Line percent={imageUpload.progress} strokeWidth="4" strokeColor={imageUpload.running ? "#00FF00" : "#D3D3D3"} />
							            </Dropzone>
							    	}
							    	{imageUpload.url &&
							    		<div>
							    			<img alt="preview" src={imageUpload.url} height='150' />
							    		</div>
							    	}
							    </div>
							    <div>
							    	<span>PDF</span>
							    	{!docUpload.url &&
							    		<Dropzone onDrop={this.handleDocUpload}>
						            		<Icon name="ei-eye" size="l" />
						            		<span>+</span>
						            		<Line percent={docUpload.progress} strokeWidth="4" strokeColor={docUpload.running ? "#00FF00" : "#D3D3D3"} />
							            </Dropzone>
							    	}
							    	{docUpload.url &&
							    		<div>
							    			<img src={docUpload.url} height='150' />
							    		</div>
							    	}
							    </div>
							</div>	
					        <Button
					        	label='Criar'
					        	type='submit'
					       	/>
					    </form>
			    </div>
		    </div>
		);
	}
}

AdminModal.defaultProps = {
};

AdminModal.propTypes = {
};

export default AdminModal;