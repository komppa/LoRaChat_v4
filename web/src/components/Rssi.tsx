import React from 'react'
import SignalCellular0Bar from '@mui/icons-material/SignalCellular0Bar'
import SignalCellular1Bar from '@mui/icons-material/SignalCellular1Bar'
import SignalCellular2Bar from '@mui/icons-material/SignalCellular2Bar'
import SignalCellular3Bar from '@mui/icons-material/SignalCellular3Bar'
import SignalCellular4Bar from '@mui/icons-material/SignalCellular4Bar'


interface RssiProps {
  rssi: number
}

const Rssi: React.FC<RssiProps> = ({ rssi }) => {

    const getSignalIcon = (rssi: number) => {
        if (rssi <= -120) {
            return <SignalCellular0Bar />
        } else if (rssi <= -110) {
            return <SignalCellular1Bar />
        } else if (rssi <= -100) {
            return <SignalCellular2Bar />
        } else if (rssi <= -90) {
            return <SignalCellular3Bar />
        } else {
            return <SignalCellular4Bar />
        }
    }

    return getSignalIcon(rssi)
}


export default Rssi