import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  function handleClick() {
    console.log("clicked");
    navigate("personal-info");
  }

  return (
    <>
      <label htmlFor="your-id" className="flex flex-col gap-1 w-full">
        Rodné číslo
        <input
          className="p-2 rounded-md outline-sky-600 border-2 border-sky-600"
          type="number"
          name="your-id"
          placeholder="xxxxxxxxx"
        />
        <small className="w-full text-center font-light text-sm">
          Vložte rodné číslo bez '/ '
        </small>
      </label>
      <button
        onClick={() => handleClick()}
        className="w-full border-sky-600 border-2 rounded-xl py-3 mt-2 text-sky-600 hover:bg-sky-600 hover:text-white transition-all duration-200 hover:border-sky-600"
      >
        Odoslať
      </button>
    </>
  );
}

export default Home;
