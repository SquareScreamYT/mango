import React from 'react';

const App = () => {
  return (
    <div style={{gap: '10px' }}>
      <div style={{ backgroundColor: 'blue', padding: '10px' }}>
        <div style={{ backgroundColor: 'lightblue', padding: '10px' }}>
          <p>Blue House</p>
        </div>
        <h1>3021 Points</h1>
        <p>#1 Today · ↑ 1 From Yesterday</p>
      </div>

      <div
        style={{
          backgroundColor: 'lightblue',
          border: '2px solid blue',
          padding: '10px',
        }}
      >
        <table style={{ borderCollapse: 'collapse' }}>
          <tbody>
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      border: '1px solid black',
                      padding: '5px',
                      width: '40px',
                      height: '30px',
                      textAlign: 'center',
                    }}
                  >
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <h1>text</h1>
      </div>

      <div style={{ backgroundColor: 'blue', padding: '10px' }}>
        <h1>text</h1>
        <p>text</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          backgroundColor: 'blue',
          padding: '10px',
        }}
      >
        {[1, 2, 3, 4].map(item => (
          <div
            key={item}
            style={{
              backgroundColor: 'lightblue',
              padding: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={``}
              alt={`image ${item}`}
              style={{ width: '100%', height: 'auto' }}
            />
            <p>text</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
