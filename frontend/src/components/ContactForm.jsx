import { useState, useEffect } from 'react';
import 'react-phone-input-2/lib/style.css';
import PhoneInput from 'react-phone-input-2';
import { submitContactForm } from '../services/ContactService'; // <-- Import the service

const ContactForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [result, setResult] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSubmitted(true); // Mark as submitted so useEffect can run
    };

    useEffect(() => {
        const submitIfNeeded = async () => {
            if (isSubmitted) {
                setLoading(true);
                if (!name.trim() || !phone.trim() || !time.trim() || !reason.trim()) {
                    alert('Please fill in all fields.');
                    setLoading(false);
                    setIsSubmitted(false);
                    return;
                }
                const data = {
                    name: name.trim(),
                    phone: phone.startsWith('+') ? phone : `+${phone}`,
                    time: time.trim(),
                    reason: reason.trim(),
                };
                try {
                    const response = await submitContactForm(data);
                    if (response.success) {
                        setResult(
                            `📞 Call Request Received\n\n👤 Name: ${name}\n📱 Phone: +${phone}\n🕒 Time: ${time}\n💬 Reason: ${reason}\n\nWe'll get back to you soon!`
                        );
                    } else if (response.message && response.message.includes('already exists')) {
                        setResult(`❗ This phone number already exists in our database. Please use a different number or contact support.`);
                    } else {
                        setResult(
                            `❌ There was a problem submitting your request. Please try again later.`
                        );
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    alert('There was an error processing your request. Please try again later.');
                } finally {
                    setLoading(false);
                    setIsSubmitted(false);
                }
            }
        };
        submitIfNeeded();
        // eslint-disable-next-line
    }, [isSubmitted]);

    return (
        <div className="flex justify-center items-center min-h-screen px-4 py-12">
            <div className="calling-card w-full max-w-2xl">
                <h1 className="text-4xl font-bold text-pink-600 text-center mb-6">📱 Call Request Form</h1>
                <p className="text-center text-gray-600 mb-5">Submit your contact details and we’ll call you back!</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-pink-700 fw-semibold">👤 Your Name</label>
                        <input
                            className="form-control"
                            placeholder="Enter your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-pink-700 fw-semibold">📞 Phone Number</label>
                        <div className="w-full">
                            <PhoneInput
                                country={'in'}
                                value={phone}
                                onChange={setPhone}
                                autocompleteSearch={true}
                                enableSearch={true}
                                inputClass="form-control !w-full"
                                // buttonClass="!border-none !bg-transparent"
                                containerClass="!w-full"
                                dropdownClass="!rounded-lg !shadow-lg"
                                inputProps={{
                                    name: 'phone',
                                    required: true,
                                    autoFocus: false,
                                    placeholder: 'Enter phone number',
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-pink-700 fw-semibold">🕒 Preferred Call Time</label>
                        <input
                            className="form-control"
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-pink-700 fw-semibold">💬 Reason for Call</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="e.g. Support, Feedback, Enquiry..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        ></textarea>
                    </div>
                    <button 
                        type="submit" 
                        className="btn btn-call w-full flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center w-full">
                                <div role="status" className="flex items-center justify-center w-full">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                    </svg>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </span>
                        ) : (
                            <span className="text-lg">📲 Request Call</span>
                        )}
                    </button>
                </form>
                {result && (
                    <div className="result-preview mt-4 whitespace-pre-line">
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactForm;