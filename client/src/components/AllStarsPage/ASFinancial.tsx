import testImage from "../../assets/FinaB3.png"

function ASFinancial() {
    return(<div className="flex flex-col gap-4 items-center p-4">
       <h2 className="text-xl font-bold">Financial Group A</h2>
       <img className="md:w-1/2" src={testImage}></img>
    </div>)
}

export default ASFinancial;
