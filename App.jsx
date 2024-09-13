import { useEffect, useState } from "react"
import "./App.css"
import FilterForm from "./components/FilterForm/FilterForm"
import CarTable from "./components/CarTable/CarTable"
import UniForm from "./components/UniForm/UniForm"
import axios from "axios"

function App() {
  const [cars, setCars] = useState([])
  const [carsToShow, setCarsToShow] = useState([])
  const [carToChange, setCarToChange] = useState({
    id: 0,
    brand: "",
    model: "",
    reg: "",
    km: "",
    year: "",
  })
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    reg: "",
    km: "",
    year: "",
  })

  const getCars = () => {
    axios
      .get("http://dominiksportfolio.cz/react-php-cars/server/index-cars.php?action=getAll")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCars(response.data)
          setCarsToShow(response.data)
        }
      })
      .catch((error) => {
        console.error("Nastala chyba", error)
        alert(`Nastala chyba: ${error}`)
      })
  }

  const insertCar = (car) => {
    axios.post('http://dominiksportfolio.cz/react-php-cars/server/index-cars/',car).then((response) => {
      getCars()
      alert("Auto úspěšně přidáno.")
    }).catch((error) => {
      console.error("Nastala chybka", error)
      alert(`Nastala chybka: ${error}`)
    })
  }

  const updateCar = (car) => {
    axios.put('http://dominiksportfolio.cz/react-php-cars/server/index-cars/',car).then((response) => {
      getCars()
      alert("Auto úspěšně upraveno.")
    }).catch((error) => {
      console.error("Nastala chybka", error)
      alert(`Nastala chybka: ${error}`)
    })
  }

  const deleteCar = (id) => {
    axios.delete(`http://dominiksportfolio.cz/react-php-cars/server/index-cars/${id}`).then((response) => {
      console.log(response.data);
      getCars();
      alert("Auto bylo úspěšně smazáno");
    }).catch((error) => {
      console.error("Nastala chybka", error)
      alert(`Nastala chybka: ${error}`)
    })
  }

  useEffect(() => {
    getCars()
  }, [])

  const filterCars = (ids) => {
    const param = ids.join()
    axios
      .get(`http://dominiksportfolio.cz/react-php-cars/server/index-cars.php?action=getSpec&ids=${param}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCarsToShow(response.data)
        }
      })
      .catch((error) => {
        console.error("Nastala chyba", error)
        alert(`Nastala chyba: ${error}`)
      })
  }

  const handleNewData = (newData, source) => {
    switch (source) {
      case "change-car-form": {
        setCarToChange(newData)
        break
      }
      case "add-car-form": {
        setNewCar(newData)
        break
      }
      default:
        break
    }
  }

  const handleFilterData = (filteredCars) => {
    const ids = filteredCars.map((car) => car.id);
    filterCars(ids);
  }

  const handleChange = (idToChange) => {
    const temp = cars.filter((car) => car.id === idToChange)
    setCarToChange(...temp)
  }

  const handleUpdate = (source) => {
    switch (source) {
      case "change-car-form": {
        const index = cars.findIndex((car) => car.id === carToChange.id)
        if (index !== -1) {
          updateCar(carToChange)
          const carsToUpdate = [...cars]
          carsToUpdate[index] = carToChange
          setCars(carsToUpdate)
          setCarsToShow(carsToUpdate)
          setCarToChange({
            id: 0,
            brand: "",
            model: "",
            reg: "",
            km: "",
            year: "",
          })
        } else {
          alert("Takové auto neexistuje v seznamu aut.")
        }
        break
      }
      case "add-car-form": {
        insertCar(newCar);
        setNewCar({
          brand: "",
          model: "",
          reg: "",
          km: "",
          year: "",
        })
        break
      }
      default:
        break
    }
  }

  const handleDelete = (idToDelete) => {
    // const temp = cars.filter((car) => car.id !== idToDelete)
    // setCars(temp)
    // setCarsToShow(temp)
    deleteCar(idToDelete)
  }

  return (
    <div className="container">
      <FilterForm data={cars} handleFilter={handleFilterData} />
      <CarTable
        data={carsToShow}
        handleChange={handleChange}
        handleDelete={handleDelete}
      />
      <p>Úprava existujícího auta</p>
      <UniForm
        id="change-car-form"
        data={carToChange}
        handleNewData={handleNewData}
        handleUpdate={handleUpdate}
      />
      <p>Přidání nového auta</p>
      <UniForm
        id="add-car-form"
        data={newCar}
        handleNewData={handleNewData}
        handleUpdate={handleUpdate}
      />
    </div>
  )
}

export default App
