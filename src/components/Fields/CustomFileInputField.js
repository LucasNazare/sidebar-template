import React, { useRef } from 'react';

function CustomFileInputField({ file, setFile, btnText, accept, showPreview }) {
    const fileInputRef = useRef();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            {/* inline everything */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                {
                    showPreview && file &&
                    <div style={{ textAlign: 'left' }}>
                        {/* round image */}
                        <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>
                }
                {!showPreview && file && file.name
                    ? <p>{file.name}</p>
                    : <></>
                }
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept={accept}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <button className='button-outlined' onClick={handleButtonClick}>
                    {btnText}
                </button>
            </div>
        </>
    );
}

export default CustomFileInputField;
