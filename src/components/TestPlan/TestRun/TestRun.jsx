import React, {useState} from 'react'
import './styles.scss'
import FiltersBlock from '../../FiltersBlock'
import TTitle from '../TTitle'
import RingLoader from '../../Loaders/RingLoader'
import TPie from '../TPie'
import TemplatePie from './components/TemplatePie'

export default function TestRun({templateItems,handleCreateTestTemplate}) {

    return (
        <div className='testRun'>
            <FiltersBlock styles={{ height: "57px" }}>
                <TTitle title="Templates"/>
            </FiltersBlock>
            <>
                {templateItems && templateItems.map((item) => 
                    <TemplatePie key={item.id} handleCreateTestTemplate={handleCreateTestTemplate} item={item} width='100%'/>
                )}
            </>
        </div>
    )
}