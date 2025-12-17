import { motion } from "framer-motion";

const Spinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-white">
      <motion.div
        className="w-12 h-12 border-4 border-t-transparent border-indigo-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 1,
        }}
      />
      <motion.p
        className="mt-4 text-sm text-gray-300 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      >
        Fetching research papers...
      </motion.p>
    </div>
  );
};

export default Spinner;
