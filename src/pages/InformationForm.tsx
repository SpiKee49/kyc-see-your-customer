import { ChangeEvent, useState } from "react";

function InformationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: ""
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form className="flex flex-col gap-5">
      <label className="text-sm">
        First Name:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Last Name:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Email:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>
      <label className="text-sm">
        Phone Number:
        <input
          className="w-full text-sm border-2 pl-4 h-10 rounded-md border-sky-600"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
      </label>

      <button
        type="submit"
        className="w-full border-sky-600 border-2 rounded-xl py-3 mt-2 text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-200 hover:border-sky-600"
      >
        Submit
      </button>
    </form>
  );
}

export default InformationForm;
