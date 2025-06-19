import Button from "./Button";
import MainLink from "./MainLink";

function ErrorPage() {
  return (
    <div className="h-[87vh] flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl m-4 font-bold">
        Whoops! You're not supposed to be here!
      </h1>
      <p className="text-white/50 text-lg p-2">
        If you got here from using the site normally, please DM me @{" "}
        <span className="font-bold text-white">thyduckylord </span> on Discord
        with details!
      </p>
      <p className="text-white/50 text-lg p-2">Click below to return to Home</p>
      <MainLink to={"/"}>
        <Button>Home</Button>
      </MainLink>
    </div>
  );
}

export default ErrorPage;
