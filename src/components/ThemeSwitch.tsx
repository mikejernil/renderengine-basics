import { FaRegMoon, FaRegSun } from 'react-icons/fa';

import { useTheme } from '../context/ThemeContext';

const ThemeSwitch: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div
            className={`backdrop-blur-md my-1 relative w-16 h-8 rounded-full border-2 flex items-center ${
                theme === 'light' ? ' bg-white/10 border-black/10' : ' bg-black/10 border-white/10'
            }`}
            onClick={toggleTheme}
        >
            <div className="absolute left-2   text-white">
                <FaRegSun size={16} />
            </div>
            <div className="absolute right-2  text-black">
                <FaRegMoon size={16} />
            </div>

            <div
                className={`border-2 absolute w-6 h-6 rounded-full bg-white  transition-transform duration-300 cursor-pointer flex items-center justify-center ${
                    theme === 'light'
                        ? 'translate-x-1 bg-white border-white'
                        : 'translate-x-8 bg-black border-black'
                }`}
            />
        </div>
    );
};

export default ThemeSwitch;
