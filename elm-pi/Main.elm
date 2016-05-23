import Html exposing (Html, div, text)
import Html.App as App
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Time exposing (Time, second)
import Array exposing (Array)
import Random

main =
  App.program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


-- MODEL
type alias Point = {x: Float, y: Float}
type alias Model = {t : Time,
                    points : Array Point,
                    seed: Random.Seed,
                    nbInside: Int}


init : (Model, Cmd Msg)
init =
  ({t= 0, points= Array.fromList([]), seed = Random.initialSeed 31415, nbInside = 0}, Cmd.none)


-- UPDATE

type Msg
  = Tick Time

size = 100

update : Msg -> Model -> (Model, Cmd Msg)
update action model =
  case action of
    Tick newTime ->
      let
        (xx, seed') = Random.step (Random.float 0 size) model.seed
        (yy, seed'') = Random.step (Random.float 0 size) seed'
        newPoints = Array.push {x = xx,
                                y = yy}
                    model.points
        nbPoints = Array.length model.points                         
        nbInside = case Array.get (nbPoints - 1) model.points of
                   Just p ->
                     if insideCircle {x = (size / 2.0), y = (size / 2.0)} (size / 2.0) p then
                       model.nbInside + 1 
                     else
                       model.nbInside
                   Nothing -> model.nbInside
      in
      ({ t = newTime, points = newPoints, seed= seed'', nbInside = nbInside}, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Time.every second Tick


-- VIEW

view : Model -> Html Msg
view model =
  let
    nbPoints = Array.length model.points
    pi = 4.0 * (toFloat model.nbInside) / (toFloat nbPoints)
  in
    div [] [svg [ viewBox "0 0 100 100", width "300px" ]
        (List.append 
            ([ circle [ cx (toString (size / 2)), cy (toString (size / 2)), r (toString (size / 2)), fill "#0B79CE" ] []
             ])
           (Array.toList (pointsView model))),
           Html.text (toString pi)]

pointsView : Model -> Array (Svg msg)
pointsView model =
  let
    displayPoint p =
      circle [ cx (toString p.x), cy (toString p.y), r "1", fill "#FF0000" ] []
    
  in
    Array.map displayPoint model.points

insideCircle : Point -> Float -> Point -> Bool
insideCircle c r p =
  let
    distance c p = sqrt ((p.x - c.x) * (p.x - c.x) + (p.y - c.y )* (p.y - c.y))
    d = distance c p
  in 
    d <= r
