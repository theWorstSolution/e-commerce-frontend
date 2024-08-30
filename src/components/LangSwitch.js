import { BsGlobe } from 'react-icons/bs';
import multiLangText from '../configs/multiLangText'
import { useContext, useMemo } from 'react';
import { globalContext } from '../contexts/globalContext';
import { Dropdown } from 'antd';
import { US, VN } from 'country-flag-icons/react/3x2'



export default function LangSwitch(){
    const { langText, setLangText } = useContext(globalContext);
    const items = useMemo(()=> [
        {
          label: (
            <a to='#' style={{ textDecoration: 'none' }} onClick={()=>setLangText(multiLangText.en)}>English</a>
          ),
          key: '0',
          icon: <US title="United States" style={{width:'16px'}}/>,
          disabled: langText==multiLangText.en
        },
        // {
        //   type: 'divider',
        // },
        {
            label: (
              <a to='#' style={{ textDecoration: 'none' }} onClick={()=>setLangText(multiLangText.vn)}>Tiếng Việt</a>
            ),
            key: '1',
            icon: <VN title="Việt Nam" style={{width:'16px'}}/>,
            disabled: langText==multiLangText.vn
          },
      ],[langText]);
    return(
        <Dropdown
          menu={{items}}
          placement="bottom"
        arrow
        >
          <div className='centerChildren' style={{cursor:'default'}}><BsGlobe className='headerIcon'/><span>{langText.language}</span></div>
        </Dropdown>
    )

}