import React, { Fragment, useState } from 'react';
import { Formik, Form } from 'formik';
import { string, object } from 'yup';

function Contact() {
	const [loading, setLoading] = useState(false);
	const [thankYou, setThankYou] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const initialValues = {
		name: '',
		email: '',
		message: ''
	};

	const validationSchema = object().shape({
		name: string().required('Name is a required field'),
		email: string()
			.email('Email must be a valid email')
			.required('Email is a required field'),
		message: string().required('Message is a required field')
	});

	async function handleSubmit(values, actions) {
		setLoading(true);
		let requestVals = Object.values(values);
		try {
			const response = await fetch(
				'ENDPOINT_ON_AWS_API_GATEWAY',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						values: requestVals
					})
				}
			);

			let responseJson = await response.json();
			if (responseJson.body.status === 200) {
				setThankYou(true);
				setLoading(false);
				actions.setSubmitting(false);
			} else {
				console.log('bad status : (');
			}
		} catch (error) {
			//something went wrong
			console.log('error : ' + error);
		}
    }
    
    // this should probably be in a different file but whatever
    function renderForm(props) {
        <Form onSubmit={props.handleSubmit}>
            <div className="row">
                <div className="col-12 col-md-6">
                    <div className="form-group mb-5">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            placeholder="Full Name"
                            value={props.values.name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                    </div>
                    {props.errors.name && submitted && (
                        <div className="alert alert-danger">
                            {props.errors.name}
                        </div>
                    )}
                </div>
                <div className="col-12 col-md-6">
                    <div className="form-group mb-5">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Email"
                            value={props.values.email}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        />
                    </div>
                    {props.errors.email && submitted && (
                        <div className="alert alert-danger">
                            {props.errors.email}
                        </div>
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="form-group mb-7 mb-md-9">
                        <label>Tell us how we can help</label>
                        <textarea
                            className="form-control"
                            id="message"
                            rows="5"
                            placeholder="Tell us how we can help"
                            value={props.values.message}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                        ></textarea>
                    </div>
                    {props.errors.message && submitted && (
                        <div className="alert alert-danger">
                            {props.errors.message}
                        </div>
                    )}
                </div>
            </div>{' '}
            <div className="row justify-content-center">
                <div className="col-auto">
                    <button
                        type="submit"
                        className="btn btn-primary lift"
                        onClick={() =>
                            props.validateForm().then(setSubmitted(true))
                        }
                    >
                        Send Message
                    </button>
                </div>
            </div>
        </Form>
    }

	return (
		<Fragment>

			<section className="py-7 py-md-10 bg-light">
				<div className="container">
					{/* <!-- / .row --> */}
					<div className="row justify-content-center">
						<div className="col-12 col-md-12 col-lg-10">
                            {/* Conditionally render based on state to show something different when submitting and after submitted */}
							{thankYou ? (
								<div className="load-container mb-md-9">
									<div>Thank you for reaching out to us!</div>
								</div>
							) : loading ? (
								<div className="load-container">
									<h2 className="loading">Recording your response</h2>
									<div
										className="spinner-large spinner-border text-primary"
										role="status"
									>
										<span className="sr-only">Recording your response</span>
									</div>
								</div>
							) : (
								<Fragment>
									<div className="row justify-content-center">
										<div className="text-center">
											<h2 className="">
												Contact us
											</h2>
											<p className="font-size-lg text-muted mb-7 mb-md-9">
												Enter your info below
											</p>
										</div>
									</div>
                                    {/* You should probably make this a component by iteself and pass in the validation schema, initial values, and the form to be rendered */}
									<Formik
										onSubmit={handleSubmit}
										initialValues={initialValues}
										validationSchema={validationSchema}
										render={}
									/>
								</Fragment>
							)}
						</div>
					</div>{' '}
					{/* <!-- / .row --> */}
				</div>{' '}
				{/* <!-- / .container --> */}
			</section>
		</Fragment>
	);
}

export default Contact;
