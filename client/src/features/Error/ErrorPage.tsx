import Button from "../../components/Button";
import MainLink from "../../components/MainLink";

function ErrorPage() {
  return (
    <div className="h-[87vh] flex flex-col items-center justify-center bg-bg-dark text-text-primary">
      <div className="bg-bg flex flex-col rounded-md border border-border text-center items-center justify-center p-4">
        <h1 className="text-3xl m-4 font-bold">
          <span className="text-red">Whoops!</span> You're not supposed to be here!
        </h1>
        <p className="text-text-secondary text-lg p-2">
          If you got here from using the site normally, please DM me @ <span className="font-bold text-primary-light">thyduckylord </span> on Discord
          with details!
        </p>
        <p className="text-text-secondary text-lg p-2">Click below to return to Home</p>
        <MainLink to={"/"}>
          <Button>Home</Button>
        </MainLink>
      </div>
    </div>
  );
}

export default ErrorPage;
