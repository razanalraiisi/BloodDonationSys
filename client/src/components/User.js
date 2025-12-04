import { useSelector } from 'react-redux';

const User = () => {
    const fullName = useSelector((state)=>state.users.user.fullName);
    const defPic = "https://i.pinimg.com/736x/b6/e6/87/b6e687094f11e465e7d710a6b5754a4e.jpg";

    return (
        <>
            <img src={defPic} className='profilepic' />
            <h1>{fullName}</h1>
        </>
    );
};

export default User;
