export const Table = ({ children }) => (
    <table className="min-w-full border-collapse border border-gray-300 mt-4">
      {children}
    </table>
  );
  
  export const TableHeader = ({ children }) => (
    <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
      {children}
    </th>
  );
  
  export const TableCell = ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-left">{children}</td>
  );
  
  export const TableRow = ({ children }) => (
    <tr className="border-b">{children}</tr>
  );

  export const UnorderedList = ({ children }) => (
  <ul className="list-disc list-inside my-2 pl-5 text-gray-800">
    {children}
  </ul>
);

export const OrderedList = ({ children }) => (
  <ol className="list-decimal list-inside my-2 pl-5 text-gray-800">
    {children}
  </ol>
);

export const ListItem = ({ children }) => (
  <li className="my-1">{children}</li>
);

export const BlockQuote = ({ children }) => (
  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">
    {children}
  </blockquote>
);
export const HorizontalRule = () => (
  <hr className="border-t-2 border-gray-300 my-4" />
);
export const Strong = ({ children }) => (
  <strong className="font-bold text-gray-800">{children}</strong>
);
export const Emphasis = ({ children }) => (
  <em className="italic text-gray-800">{children}</em>
);
export const Strikethrough = ({ children }) => (
  <span className="line-through text-gray-800">{children}</span>
);
export const CodeBlock = ({ children }) => (
  <pre className="bg-gray-100 p-4 rounded-md my-2">
    <code className="text-gray-800">{children}</code>
  </pre>
);
export const Image = ({ src, alt }) => (
  <img src={src} alt={alt} className="my-2 max-w-full h-auto" />
);
export const Link = ({ href, children }) => (
  <a href={href} className="text-blue-600 hover:underline">
    {children}
  </a>
);
export const H1 = ({ children }) => (
  <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900">{children}</h1>
);

export const H2 = ({ children }) => (
  <h2 className="text-3xl font-semibold mt-5 mb-3 text-gray-900">{children}</h2>
);

export const H3 = ({ children }) => (
  <h3 className="text-2xl font-semibold mt-4 mb-2 text-gray-900">{children}</h3>
);

export const H4 = ({ children }) => (
  <h4 className="text-xl font-medium mt-3 mb-1.5 text-gray-900">{children}</h4>
);

export const H5 = ({ children }) => (
  <h5 className="text-lg font-medium mt-2 mb-1 text-gray-900">{children}</h5>
);

export const H6 = ({ children }) => (
  <h6 className="text-base font-medium mt-1.5 mb-1 text-gray-900">{children}</h6>
);
