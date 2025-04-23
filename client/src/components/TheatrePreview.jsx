import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLocation, useParams } from "react-router-dom"
import { FaWheelchair } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { FaUser } from "react-icons/fa";
import { BsBadgeHdFill } from "react-icons/bs";

const TheatrePreview = ({rows, onSeatSelect, onSeatDeselect, selectedSeats, totalTickets}) => {

  const [theatrePreview, setTheatrePreview] = useState(rows)

  const handleSeatClick = (rowIndex, section, seatIndex) => {
    const rowData = theatrePreview[rowIndex];
  
    const leftSize = rowData.seatsLeft?.length || 0;
    const middleSize = rowData.seatsMiddle?.length || 0;
  
    let globalSeatNumber;
    if (section === "seatsLeft") {
      globalSeatNumber = seatIndex;
    } else if (section === "seatsMiddle") {
      globalSeatNumber = leftSize + seatIndex;
    } else if (section === "seatsRight") {
      globalSeatNumber = leftSize + middleSize + seatIndex;
    }
  
    const seatObject = {
      row: rowData.row,
      number: globalSeatNumber,
      rowNumber: rowIndex + 1,
    };
  
    const seatStatus = rowData[section][seatIndex];

    if (seatStatus === "O") {
      return; // Don't allow selection of occupied seats
}
  
    if (["NB", "NBW", "NBWC"].includes(seatStatus)) {
      if (selectedSeats.length > totalTickets - 1) {
        alert("You are trying to add more seats than you have selected.");
        return;
      }
  
      onSeatSelect && onSeatSelect({ seat: seatObject });
    }
  
    if (["B", "BW", "BWC"].includes(seatStatus)) {
      onSeatDeselect && onSeatDeselect({ seat: seatObject });
    }
  
    // Update local theatrePreview state
    setTheatrePreview(prev => (
      prev.map((row, index) => {
        if (index !== rowIndex) return row;
        return {
          ...row,
          [section]: row[section].map((seat, idx) => {
            if (idx !== seatIndex) return seat;
            if (seat === "NB") return "B";
            if (seat === "B") return "NB";
            if (seat === "NBW") return "BW";
            if (seat === "BW") return "NBW";
            if (seat === "NBWC") return "BWC";
            if (seat === "BWC") return "NBWC";
            return seat;
          })
        };
      })
    ));
  };  

  return (
  <div className="flex flex-col justify-center items-center gap-2">
    <h1 className="text-lg font-bold bg-white text-black text-center w-[500px] rounded-2xl h-[30px] align-middle mb-5">
      SCREEN
    </h1>
    {theatrePreview.map(({ row, seatsLeft, seatsMiddle, seatsRight }, rowIndex) => (
      row === 'J' ? (
        <div key={row}>
          <div className="flex flex-row gap-[50px]" key={`${row}`}>
            <div className="w-fit flex flex-col items-center justify-center font-bold" key={`left-${row}`}>{row}</div>

            <div className="flex flex-row items-start justify-start gap-2 w-[180px]">
              {seatsLeft.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                    key={`${row}-seatsLeft-${index}`}
                  ></div>
                ) : seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-end justify-center gap-2 w-fit">
              {seatsMiddle.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                    key={`${row}-seats-middle-${index}`}
                  ></div>
                )
                : seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-end justify-end gap-2 w-[180px]">
              {seatsRight.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seatsright-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  ></div>
                ): seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seatsright-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="w-[30px] flex flex-col items-center justify-center font-bold" key={`right-${row}`}>
              {row}
            </div>
          </div>
        </div>
      ) : row === 'I' ? (
        <div key={row}>
          <div className="flex flex-row gap-[50px]" key={`${row}-left`}>
            <div className="w-[10px] flex flex-col items-center justify-center font-bold" key={`${row}-left`}>
              {row}
            </div>

            <div className="flex flex-row items-end justify-end gap-2 w-[180px]">
              {seatsLeft.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  ></div>
                ): seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-end justify-center gap-2 w-fit">
              {seatsMiddle.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  ></div>
                ): seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-start justify-start gap-2 w-[180px]">
              {seatsRight.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  ></div>
                ) : seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seatsright-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="w-[30px] flex flex-col items-center justify-center font-bold" key={`${row}-right`}>
              {row}
            </div>
          </div>
        </div>
      ) : (
        <div key={row}>
          <div className="flex flex-row gap-[50px]" key={`${row}-left`}>
            <div className="w-fit flex flex-col items-center justify-center font-bold" key={rowIndex}>
              {row}
            </div>

            <div className="flex flex-row items-end justify-end gap-2 w-[180px]">
              {seatsLeft.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  ></div>
                ): seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seatsLeft-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsLeft', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-end justify-center gap-2 w-fit">
              {seatsMiddle.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  ></div>
                ) : seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "NBW" ? (
                  <FaWheelchair
                    className="w-[30px] h-[30px] fill-white"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "NBWC" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-400 rounded-lg"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  ></div>
                ) : seat === "BW" ? (
                  <FaWheelchair
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : seat === "BWC" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-middle-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsMiddle', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="flex flex-row items-start justify-start gap-2 w-[180px]">
              {seatsRight.map((seat, index) => (
                seat === "NB" ? (
                  <div
                    className="w-[30px] h-[30px] bg-blue-600 rounded-lg cursor-pointer"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  ></div>
                ): seat === "O" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-slate-500"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ): seat === "B" ? (
                  <FaUser
                    className="w-[30px] h-[30px] fill-green-500"
                    key={`${row}-seats-right-${index}`}
                    onClick={() => handleSeatClick(rowIndex, 'seatsRight', index)}
                  />
                ) : null
              ))}
            </div>

            <div className="w-[30px] flex flex-col items-center justify-center font-bold" key={`${row}-right`}>
              {row}
            </div>
          </div>
        </div>
      )
    ))}

    <CardTitle className="text-md mt-3">Seat Information</CardTitle>

    <div className="flex flex-row justify-center items-center gap-[80px]">
      <div className="flex flex-row gap-3 items-center">
        <div className="w-[30px] h-[30px] bg-blue-600 rounded-lg"></div>
        <h1>Standard</h1>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <FaUser className="w-[25px] h-[25px] fill-green-500" />
        <h1>Selected Seat</h1>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <FaUser className="w-[25px] h-[25px] fill-slate-500" />
        <h1>Occupied</h1>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <FaWheelchair className="w-[25px] h-[25px] fill-white" />
        <h1>Wheelchair</h1>
      </div>
      <div className="flex flex-row gap-3 items-center">
        <div className="w-[30px] h-[30px] bg-blue-400 rounded-lg"></div>
        <h1>Wheelchair Companion</h1>
      </div>
    </div>
  </div>

  )
}

export default TheatrePreview