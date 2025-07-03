import { useState, useEffect } from 'react';

const ContactForm = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [result, setResult] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!name.trim() || !phone.trim() || !time.trim() || !reason.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        const preview = `📞 Call Request Received

👤 Name: ${name}
📱 Phone: ${phone}
🕒 Time: ${time}
💬 Reason: ${reason}

We'll get back to you soon!`;
        setResult(preview);
    };

    // Call handleSubmit automatically when all fields are filled
    useEffect(() => {
        if (name && phone && time && reason && !isSubmitted) {
            handleSubmit();
        }
        // eslint-disable-next-line
    }, [name, phone, time, reason, isSubmitted]);

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
                        <input
                            className="form-control"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
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
                        className="btn btn-call w-full"
                        onClick={() => setIsSubmitted(true)}    
                    >📲 Request Call</button>
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