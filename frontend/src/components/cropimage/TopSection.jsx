import React from "react";

export const TopSection = ({ setUrl }) => {

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="inputs">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="input"
      />
    </div>
  );
};
