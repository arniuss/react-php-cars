<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json; charset=utf-8");

include("DbConnect.php");
$connection = new DbConnect();
$database = $connection->connect();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $action = isset($_GET['action']) ? $_GET['action'] : '';
        if ($action == 'getAll') {
            $sql = 'SELECT * FROM cars';
            $stmt = $database->prepare($sql);
            $stmt->execute();
            $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($cars, JSON_UNESCAPED_UNICODE);
        } else if ($action == 'getSpec') {
            $idsParam = isset($_GET['ids']) ? $_GET['ids'] : '';
            $ids = explode(',', $idsParam);
            $ids = array_filter($ids, function ($value) {
                return $value !== '';
            });
            $ids = implode(',', array_map('intval', $ids));
            if (!empty($ids)) {
                $sql = "SELECT * FROM cars WHERE id IN ($ids)";
                $stmt = $database->prepare($sql);
                $stmt->execute();
                $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($cars, JSON_UNESCAPED_UNICODE);
            }

        }
        break;
    case "POST":
        $car = json_decode(file_get_contents("php://input"));
        $sql = 'INSERT INTO cars (brand, model, reg, km, year) values (:brand, :model,:reg,:km,:year)';
        $stmt = $database->prepare($sql);
        $stmt->bindParam(':brand', $car->brand, PDO::PARAM_STR);
        $stmt->bindParam(':model', $car->model, PDO::PARAM_STR);
        $stmt->bindParam(':reg', $car->reg, PDO::PARAM_STR);
        $stmt->bindParam(':km', $car->km, PDO::PARAM_STR);
        $stmt->bindParam(':year', $car->year, PDO::PARAM_INT);
        if($stmt->execute()) {
            $data = ['status' => 1, 'message' => "Auto úspěšně smazáno."];
        } else {
            $data = ['status' => 0, 'message' => "Chyba při vložení auta."];
        }
        echo json_encode($data);
        break;
    case "DELETE":
        $requestPath = $_SERVER['REQUEST_URI'];
        $pathSegments = explode('/', trim($requestPath,'/'));
        $carId = (int) $pathSegments[count($pathSegments) - 1];
        if($carId > 0) {
            $sql = 'DELETE FROM cars WHERE id = :id';
            $stmt = $database->prepare($sql);
            $stmt->bindParam(':id', $carId, PDO::PARAM_INT);
            if ($stmt->execute()) {
                $data = ['status' => 1, 'message' => "Auto úspěšně smazáno."];
            } else {
                $data = ['status'=> 0,'message'=> "Chyba při mazání auta."];
            }
        } else {
            $data = ['status'=> 0,'message'=> "Id nebylo numerické."];
        }
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        break;
    case "PUT":
        $car = json_decode(file_get_contents("php://input"));
        $sql = 'UPDATE cars SET brand = :brand, model = :model, reg = :reg, km = :km, year = :year WHERE id = :id';
        $stmt = $database->prepare($sql);
        $stmt->bindParam('id', $car->id, PDO::PARAM_INT);
        $stmt->bindParam(':brand', $car->brand, PDO::PARAM_STR);
        $stmt->bindParam(':model', $car->model, PDO::PARAM_STR);
        $stmt->bindParam(':reg', $car->reg, PDO::PARAM_STR);
        $stmt->bindParam(':km', $car->km, PDO::PARAM_STR);
        $stmt->bindParam(':year', $car->year, PDO::PARAM_INT);
        if($stmt->execute()) {
            $data = ['status' => 1, 'message' => "Auto úspěšně udpatováno."];
        } else {
            $data = ['status' => 0, 'message' => "Chyba při updatování vozidla."];
        }
        echo json_encode($data);
        break;
    default:
        break;
}
?>