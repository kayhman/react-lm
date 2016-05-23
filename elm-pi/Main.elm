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
                    seed: Random.Seed}


init : (Model, Cmd Msg)
init =
  ({t= 0, points= Array.fromList([]), seed = Random.initialSeed 31415}, Cmd.none)


-- UPDATE

type Msg
  = Tick Time


update : Msg -> Model -> (Model, Cmd Msg)
update action model =
  case action of
    Tick newTime ->
      let
        (xx, seed') = Random.step (Random.float 0 100) model.seed
        (yy, seed'') = Random.step (Random.float 0 100) seed'
        newPoints = Array.push {x = xx,
                                y = yy}
                    model.points
      in
      ({t = newTime, points = newPoints, seed= seed''}, Cmd.none)


-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Time.every second Tick


-- VIEW

view : Model -> Html Msg
view model =
  let
    angle =
      turns (Time.inMinutes model.t)

    handX =
      toString (50 + 40 * cos angle)

    handY =
      toString (50 + 40 * sin angle)
    
  in
    div [] [ Html.text "coucou",
    svg [ viewBox "0 0 100 100", width "300px" ]
        (List.append 
            ([ circle [ cx "50", cy "50", r "45", fill "#0B79CE" ] [],
                 line [ x1 "50", y1 "50", x2 handX, y2 handY, stroke "#023963" ] []
             ])
           (Array.toList (pointsView model)))]

pointsView : Model -> Array (Svg msg)
pointsView model =
  let
    displayPoint p =
      circle [ cx (toString p.x), cy (toString p.y), r "1", fill "#FF0000" ] []
    
  in
    Array.map displayPoint model.points
