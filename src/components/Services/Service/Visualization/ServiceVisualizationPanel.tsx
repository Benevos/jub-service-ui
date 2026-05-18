'use client'

import { TabPanel } from '@mui/lab'
import ServiceProducts from './Sink/ServiceProducts'
import ServiceDatasource from './Datasource/ServiceDatasource'

function ServiceVisualizationPanel() 
{
    return (
        <TabPanel sx={{ padding: 0 }} value={"2"}>

            <ServiceDatasource/>

            <ServiceProducts/>

        </TabPanel>
    )
}

export default ServiceVisualizationPanel