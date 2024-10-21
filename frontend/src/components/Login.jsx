import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform login logic here, e.g., API call
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Signup</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
    
        <button type="submit" style={styles.button}>Signup</button>
      </form>
    </div>
  );
}

// Basic styles for the form
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
    // backgroundColor: '#f0f0f0',
    color:'white',
  },
  form: {
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    // backgroundColor: '#ffffff',
    width: '300px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '9B7EBD',
  },
  inputGroup: {
    marginBottom: '15px',
    color:'white',
  },
  input: {
    // width: '100%',
    padding: '8px',
    marginTop: '5px',
    boxSizing: 'border-box',
    width: '100%',
    padding: '1rem 1.5rem', /* py-2 px-4 */
    border: '1px solid #cbd5e1', /* border border-gray-300 */
    borderRadius: '0.5rem', /* rounded-lg */
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
    transitionProperty: 'all',
    transitionDuration: '300ms', 
    transitionTimingFunction: 'ease-in-out',
    backgroundColor: '#f7fafc',
    color:'black'

  },
  inputHover:{
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderColor: '#90cdf4',
  },
  
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default LoginForm;
