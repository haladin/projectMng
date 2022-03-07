using System.Text;

namespace Api.DataServices;

public class FileHelper
{

    public static async Task<List<string>> ReadAllFiles(string path)
    {
        var files = new List<string>();
        
        try
        {
            if (CheckPath(path))
            {
                var fileNames = Directory.GetFiles(path);
                foreach (var file in fileNames)
                {

                    if (File.Exists(file) != false)
                    {
                        string text = await ReadAllTextAsync(file);
                        files.Add(text);
                        Console.WriteLine(text);
                    }
                    else
                    {
                        Console.WriteLine($"file not found: {file}");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return files;
    }

    public static async Task<string> ReadAFiles(string path, string id)
    {
        string file = null;

        try
        {
            if (!CheckPath(path))
            {
                return null;
            }

            var fileNames = Directory.GetFiles(path);
            var fileName = Path.GetFullPath(Path.Combine(path, id));
            if (File.Exists(fileName) != false)
            {
                file = await ReadAllTextAsync(fileName);
                Console.WriteLine(fileName);
            }
            else
            {
                Console.WriteLine($"file not found: {fileName}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return file;
    }

    private static async Task<string> ReadAllTextAsync(string path)
    {
        switch (path)
        {
            case "": throw new ArgumentException("Empty path name is not legal.", nameof(path));
            case null: throw new ArgumentNullException(nameof(path));
        }

        using var sourceStream = new FileStream(path, FileMode.Open,
            FileAccess.Read, FileShare.Read,
            bufferSize: 4096,
            useAsync: true);
        using var streamReader = new StreamReader(sourceStream, Encoding.UTF8,
            detectEncodingFromByteOrderMarks: true);
        // detectEncodingFromByteOrderMarks allows you to handle files with BOM correctly. 
        // Otherwise you may get chinese characters even when your text does not contain any

        return await streamReader.ReadToEndAsync();
    }

    public static async Task ProcessMulitpleWritesAsync(Dictionary<string, string> files, string fullPath)
    {
        IList<FileStream> sourceStreams = new List<FileStream>();

        try
        {
            IList<Task> writeTaskList = new List<Task>();
            CheckPath(fullPath);

            foreach (var kv in files)
            {
                string fileName = $"{kv.Key}";
                string filePath = Path.GetFullPath(Path.Combine(fullPath, fileName));

                byte[] encodedText = Encoding.UTF8.GetBytes(kv.Value);

                var sourceStream =
                    new FileStream(
                        filePath,
                        FileMode.Create, FileAccess.Write, FileShare.None,
                        bufferSize: 4096, useAsync: true);

                Task writeTask = sourceStream.WriteAsync(encodedText, 0, encodedText.Length);
                sourceStreams.Add(sourceStream);

                writeTaskList.Add(writeTask);
            }

            await Task.WhenAll(writeTaskList);
        }
        finally
        {
            foreach (FileStream sourceStream in sourceStreams)
            {
                sourceStream.Close();
            }
        }
    }

    public static string CreateId(string fullPath)
    {
        var chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        var stringChars = new char[12];
        var random = new Random();
        var id = "";

        try
        {
            CheckPath(fullPath);

            var fileNames = Directory.GetFiles(fullPath).ToList().Select( f => Path.GetFileName(f));
            do
            {
                for (int i = 0; i < stringChars.Length; i++)
                {
                    stringChars[i] = chars[random.Next(chars.Length)];
                }
                id = new string(stringChars);
            } while (fileNames.Contains(id));

        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }

        return id;
    }

    public static Task DeleteFile(string path, string id)
    {
        return Task.Run(() => { System.IO.File.Delete(Path.GetFullPath(Path.Combine(path, id))); }); 
    }

    private static bool CheckPath(string fullPath)
    {
        if (!Directory.Exists(fullPath))
        {
            var di = Directory.CreateDirectory(fullPath);
            Console.WriteLine($"The directory {fullPath} was created successfully at {Directory.GetCreationTime(fullPath)}.");
            return false;
        }

        return true;
    }
}
